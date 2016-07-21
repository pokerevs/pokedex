package main

import "os"

type Config struct {
	db           string
	jwt_secret   string
	host         string
	newrelic_key string
}

func LoadConfigFromEnvironment() Config {
	config := Config{
		db:           os.Getenv("DB"),
		jwt_secret:   os.Getenv("JWT_SECRET"),
		host:         os.Getenv("PORT"),
		newrelic_key: os.Getenv("NEWRELIC_KEY"),
	}
	if config.host == "" {
		config.host = ":8080"
	}
	return config
}
