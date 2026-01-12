package storage

import (
	"fmt"
	"net/smtp"
	"os"
)

// SMTPStorage sends email notifications for new signups
type SMTPStorage struct {
	host     string
	port     string
	user     string
	pass     string
	from     string
	to       string
	fallback Storage
}

// NewSMTPStorage creates a new SMTP notification storage
func NewSMTPStorage() (*SMTPStorage, error) {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		return nil, fmt.Errorf("SMTP_HOST is required for smtp storage")
	}

	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "587"
	}

	from := os.Getenv("SMTP_FROM")
	to := os.Getenv("SMTP_TO")
	if from == "" || to == "" {
		return nil, fmt.Errorf("SMTP_FROM and SMTP_TO are required")
	}

	// Create fallback JSON storage to also persist locally
	jsonPath := os.Getenv("JSON_PATH")
	if jsonPath == "" {
		jsonPath = "/data/emails.json"
	}
	fallback, _ := NewJSONStorage(jsonPath)

	return &SMTPStorage{
		host:     host,
		port:     port,
		user:     os.Getenv("SMTP_USER"),
		pass:     os.Getenv("SMTP_PASS"),
		from:     from,
		to:       to,
		fallback: fallback,
	}, nil
}

// Save sends an email notification and stores the entry
func (s *SMTPStorage) Save(entry EmailEntry) error {
	// First, save to fallback storage
	if s.fallback != nil {
		if err := s.fallback.Save(entry); err != nil {
			return err
		}
	}

	// Send email notification
	subject := "New Waitlist Signup"
	body := fmt.Sprintf(`New signup on your waitlist!

Email: %s
Time: %s
IP: %s

---
Sent by Waitlist
`, entry.Email, entry.Timestamp.Format("2006-01-02 15:04:05 UTC"), entry.IP)

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		s.from, s.to, subject, body)

	addr := fmt.Sprintf("%s:%s", s.host, s.port)

	var auth smtp.Auth
	if s.user != "" && s.pass != "" {
		auth = smtp.PlainAuth("", s.user, s.pass, s.host)
	}

	if err := smtp.SendMail(addr, auth, s.from, []string{s.to}, []byte(msg)); err != nil {
		// Log error but don't fail - we already saved to fallback
		fmt.Printf("Warning: failed to send email notification: %v\n", err)
	}

	return nil
}

// List returns entries from the fallback storage
func (s *SMTPStorage) List() ([]EmailEntry, error) {
	if s.fallback != nil {
		return s.fallback.List()
	}
	return nil, fmt.Errorf("list not available without fallback storage")
}
