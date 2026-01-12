package storage

import (
	"fmt"
	"os"
	"strings"
)

// MultiStorage combines multiple storage backends
type MultiStorage struct {
	storages []Storage
	primary  Storage // Used for List()
}

// NewMultiStorage creates a storage that writes to multiple backends
func NewMultiStorage() (*MultiStorage, error) {
	backends := os.Getenv("STORAGE_BACKENDS")
	if backends == "" {
		backends = "json"
	}

	var storages []Storage
	var primary Storage

	for _, backend := range strings.Split(backends, ",") {
		backend = strings.TrimSpace(backend)
		var s Storage
		var err error

		switch backend {
		case "json":
			path := os.Getenv("JSON_PATH")
			if path == "" {
				path = "/data/emails.json"
			}
			s, err = NewJSONStorage(path)
			if err == nil && primary == nil {
				primary = s
			}

		case "webhook":
			url := os.Getenv("WEBHOOK_URL")
			if url != "" {
				secret := os.Getenv("WEBHOOK_SECRET")
				s = NewWebhookStorage(url, secret)
			}
		}

		if err != nil {
			return nil, fmt.Errorf("failed to initialize %s storage: %w", backend, err)
		}
		if s != nil {
			storages = append(storages, s)
		}
	}

	if len(storages) == 0 {
		return nil, fmt.Errorf("no storage backends configured")
	}

	if primary == nil {
		primary = storages[0]
	}

	return &MultiStorage{
		storages: storages,
		primary:  primary,
	}, nil
}

// Save writes to all configured storage backends
func (m *MultiStorage) Save(entry EmailEntry) error {
	var firstErr error

	for _, s := range m.storages {
		if err := s.Save(entry); err != nil {
			if firstErr == nil && err != ErrDuplicate {
				firstErr = err
			}
			// For duplicate errors, propagate immediately
			if err == ErrDuplicate {
				return err
			}
		}
	}

	return firstErr
}

// List returns entries from the primary storage
func (m *MultiStorage) List() ([]EmailEntry, error) {
	return m.primary.List()
}
