package main

import (
	"embed"
	"log"
	"net/http"
	"os"

	"github.com/Synapsr/WaitList-Page/storage"
)

//go:embed static/*
var staticFS embed.FS

func main() {
	port := getEnv("PORT", "3000")

	// Initialize storage
	store, err := storage.New()
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Create handler
	handler := NewHandler(store)

	// Routes
	mux := http.NewServeMux()
	mux.HandleFunc("/", handler.ServePage)
	mux.HandleFunc("/api/subscribe", handler.Subscribe)
	mux.HandleFunc("/api/health", handler.Health)
	mux.HandleFunc("/api/emails", handler.ListEmails)

	// Start server
	log.Printf("🚀 Waitlist server running on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
