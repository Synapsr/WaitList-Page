package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

// JSONStorage stores emails in a JSON file
type JSONStorage struct {
	path   string
	mu     sync.RWMutex
	emails map[string]EmailEntry
}

// NewJSONStorage creates a new JSON file storage
func NewJSONStorage(path string) (*JSONStorage, error) {
	// Ensure directory exists
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}

	s := &JSONStorage{
		path:   path,
		emails: make(map[string]EmailEntry),
	}

	// Load existing data if file exists
	if err := s.load(); err != nil && !os.IsNotExist(err) {
		return nil, err
	}

	return s, nil
}

// Save stores a new email entry
func (s *JSONStorage) Save(entry EmailEntry) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check for duplicate
	if _, exists := s.emails[entry.Email]; exists {
		return ErrDuplicate
	}

	s.emails[entry.Email] = entry
	return s.persist()
}

// List returns all stored emails
func (s *JSONStorage) List() ([]EmailEntry, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	entries := make([]EmailEntry, 0, len(s.emails))
	for _, entry := range s.emails {
		entries = append(entries, entry)
	}
	return entries, nil
}

func (s *JSONStorage) load() error {
	data, err := os.ReadFile(s.path)
	if err != nil {
		return err
	}

	var entries []EmailEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return err
	}

	for _, entry := range entries {
		s.emails[entry.Email] = entry
	}
	return nil
}

func (s *JSONStorage) persist() error {
	entries := make([]EmailEntry, 0, len(s.emails))
	for _, entry := range s.emails {
		entries = append(entries, entry)
	}

	data, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.path, data, 0644)
}
