package main

import (
	"encoding/json"
	"html/template"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/Synapsr/WaitList-Page/storage"
)

// Handler handles HTTP requests
type Handler struct {
	store       storage.Storage
	rateLimiter *RateLimiter
	template    *template.Template
}

// RateLimiter provides basic rate limiting
type RateLimiter struct {
	mu       sync.Mutex
	requests map[string][]time.Time
	limit    int
	window   time.Duration
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
}

// Allow checks if a request is allowed
func (rl *RateLimiter) Allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-rl.window)

	// Filter old requests
	var recent []time.Time
	for _, t := range rl.requests[ip] {
		if t.After(cutoff) {
			recent = append(recent, t)
		}
	}

	if len(recent) >= rl.limit {
		return false
	}

	rl.requests[ip] = append(recent, now)
	return true
}

// NewHandler creates a new Handler
func NewHandler(store storage.Storage) *Handler {
	tmpl, err := template.ParseFS(staticFS, "static/index.html")
	if err != nil {
		panic("Failed to parse template: " + err.Error())
	}

	return &Handler{
		store:       store,
		rateLimiter: NewRateLimiter(5, time.Minute), // 5 requests per minute
		template:    tmpl,
	}
}

// ServePage serves the main waitlist page
func (h *Handler) ServePage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	config := LoadConfig()

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := h.template.Execute(w, config); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// SubscribeRequest represents an email subscription request
type SubscribeRequest struct {
	Email string `json:"email"`
}

// SubscribeResponse represents the response to a subscription request
type SubscribeResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Subscribe handles email subscription
func (h *Handler) Subscribe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonResponse(w, http.StatusMethodNotAllowed, SubscribeResponse{
			Success: false,
			Message: "Method not allowed",
		})
		return
	}

	// Rate limiting
	ip := getIP(r)
	if !h.rateLimiter.Allow(ip) {
		jsonResponse(w, http.StatusTooManyRequests, SubscribeResponse{
			Success: false,
			Message: "Too many requests. Please try again later.",
		})
		return
	}

	var req SubscribeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, http.StatusBadRequest, SubscribeResponse{
			Success: false,
			Message: "Invalid request",
		})
		return
	}

	// Validate email
	email := strings.TrimSpace(strings.ToLower(req.Email))
	if !isValidEmail(email) {
		jsonResponse(w, http.StatusBadRequest, SubscribeResponse{
			Success: false,
			Message: "Please enter a valid email address",
		})
		return
	}

	// Store email
	entry := storage.EmailEntry{
		Email:     email,
		Timestamp: time.Now().UTC(),
		IP:        ip,
		UserAgent: r.UserAgent(),
	}

	if err := h.store.Save(entry); err != nil {
		if err == storage.ErrDuplicate {
			jsonResponse(w, http.StatusConflict, SubscribeResponse{
				Success: false,
				Message: "This email is already on the waitlist",
			})
			return
		}
		jsonResponse(w, http.StatusInternalServerError, SubscribeResponse{
			Success: false,
			Message: "Something went wrong. Please try again.",
		})
		return
	}

	config := LoadConfig()
	jsonResponse(w, http.StatusOK, SubscribeResponse{
		Success: true,
		Message: config.SuccessMessage,
	})
}

// Health returns server health status
func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// ListEmails returns all collected emails (protected)
func (h *Handler) ListEmails(w http.ResponseWriter, r *http.Request) {
	// Simple token-based auth
	token := r.Header.Get("Authorization")
	expectedToken := getEnv("ADMIN_TOKEN", "")

	if expectedToken == "" || token != "Bearer "+expectedToken {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	emails, err := h.store.List()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(emails)
}

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func getIP(r *http.Request) string {
	// Check common proxy headers
	if ip := r.Header.Get("X-Forwarded-For"); ip != "" {
		return strings.Split(ip, ",")[0]
	}
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return ip
	}
	return strings.Split(r.RemoteAddr, ":")[0]
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func isValidEmail(email string) bool {
	return len(email) <= 254 && emailRegex.MatchString(email)
}
