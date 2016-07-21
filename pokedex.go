package main

import (
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	log.Print("Welcome to Pokédex. Gotta OH FUCK THAT SHOULD HAVE WORKED them all!")

	config := LoadConfigFromEnvironment()
	router := gin.Default()

	router.Run(config.host)
}
