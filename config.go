package main

import (
	"os"
)

// Config holds all configuration from environment variables
type Config struct {
	// Display
	Title          string
	Subtitle       string
	LogoURL        string
	PrimaryColor   string
	Theme          string
	CountdownDate  string
	SuccessMessage string
	Placeholder    string
	ButtonText     string

	// Meta
	MetaTitle       string
	MetaDescription string
}

// LoadConfig reads configuration from environment variables
func LoadConfig() Config {
	return Config{
		Title:           getEnv("TITLE", "Something awesome is coming"),
		Subtitle:        getEnv("SUBTITLE", "Be the first to know when we launch. Join our waitlist today."),
		LogoURL:         getEnv("LOGO_URL", ""),
		PrimaryColor:    getEnv("PRIMARY_COLOR", "#6366f1"),
		Theme:           getEnv("THEME", "light"),
		CountdownDate:   getEnv("COUNTDOWN_DATE", ""),
		SuccessMessage:  getEnv("SUCCESS_MESSAGE", "You're on the list!"),
		Placeholder:     getEnv("PLACEHOLDER", "Enter your email"),
		ButtonText:      getEnv("BUTTON_TEXT", "Join Waitlist"),
		MetaTitle:       getEnv("META_TITLE", "Join the Waitlist"),
		MetaDescription: getEnv("META_DESCRIPTION", "Be the first to know when we launch."),
	}
}

func getEnvFromConfig(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
