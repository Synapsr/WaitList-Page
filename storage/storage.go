package storage

import (
	"errors"
	"os"
	"time"
)

// ErrDuplicate is returned when an email already exists
var ErrDuplicate = errors.New("email already exists")

// EmailEntry represents a collected email
type EmailEntry struct {
	Email     string    `json:"email"`
	Timestamp time.Time `json:"timestamp"`
	IP        string    `json:"ip,omitempty"`
	UserAgent string    `json:"user_agent,omitempty"`
}

// Storage defines the interface for email storage backends
type Storage interface {
	Save(entry EmailEntry) error
	List() ([]EmailEntry, error)
}

// New creates a new storage based on STORAGE_TYPE environment variable
func New() (Storage, error) {
	storageType := os.Getenv("STORAGE_TYPE")
	if storageType == "" {
		storageType = "json"
	}

	switch storageType {
	case "json":
		path := os.Getenv("JSON_PATH")
		if path == "" {
			path = "/data/emails.json"
		}
		return NewJSONStorage(path)

	case "webhook":
		url := os.Getenv("WEBHOOK_URL")
		if url == "" {
			return nil, errors.New("WEBHOOK_URL is required for webhook storage")
		}
		secret := os.Getenv("WEBHOOK_SECRET")
		return NewWebhookStorage(url, secret), nil

	case "smtp":
		return NewSMTPStorage()

	case "multi":
		// Support multiple storage backends
		return NewMultiStorage()

	default:
		return nil, errors.New("unknown storage type: " + storageType)
	}
}
