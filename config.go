package main

import (
	"errors"
	"os"
)

type Config struct {
	db           string
	jwt_secret   string
	host         string
	newrelic_key string
	server_mode  string
}

func LoadConfigFromEnvironment() (Config, error) {
	config := Config{
		db:           os.Getenv("DB"),
		jwt_secret:   os.Getenv("JWT_SECRET"),
		host:         os.Getenv("HOST"),
		newrelic_key: os.Getenv("NEWRELIC_KEY"),
		server_mode:  "release",
	}
	if config.host == "" {
		config.host = ":8080"
	}
	if os.Getenv("DEBUG") != "" {
		config.server_mode = "debug"
	}
	if config.jwt_secret == "" {
		return config, errors.New("A JWT secret must be provided in $JWT_SECRET!")
	}
	if config.db == "" {
		return config, errors.New("A mongodb url must be provided in $DB!")
	}
	return config, nil
}
