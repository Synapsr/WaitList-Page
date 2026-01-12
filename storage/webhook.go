package storage

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// WebhookStorage sends emails to a webhook URL
type WebhookStorage struct {
	url    string
	secret string
	client *http.Client
}

// NewWebhookStorage creates a new webhook storage
func NewWebhookStorage(url, secret string) *WebhookStorage {
	return &WebhookStorage{
		url:    url,
		secret: secret,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// Save sends the email entry to the webhook
func (s *WebhookStorage) Save(entry EmailEntry) error {
	payload, err := json.Marshal(entry)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, s.url, bytes.NewBuffer(payload))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Waitlist/1.0")

	// Add HMAC signature if secret is configured
	if s.secret != "" {
		signature := s.sign(payload)
		req.Header.Set("X-Webhook-Signature", signature)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("webhook request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("webhook returned status %d", resp.StatusCode)
	}

	return nil
}

// List is not supported for webhook storage
func (s *WebhookStorage) List() ([]EmailEntry, error) {
	return nil, fmt.Errorf("list not supported for webhook storage")
}

func (s *WebhookStorage) sign(payload []byte) string {
	mac := hmac.New(sha256.New, []byte(s.secret))
	mac.Write(payload)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}
