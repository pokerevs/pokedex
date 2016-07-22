package main

import (
	"github.com/pokerevs/pokedex/api"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"

	"log"
	"net/http"
)

func main() {
	log.Print("Welcome to Pokédex. Gotta OH FUCK THAT SHOULD HAVE WORKED them all!")

	config := LoadConfigFromEnvironment()

	r := mux.NewRouter()

	n := negroni.New(negroni.Logger, negroni.Recovery)
	n.UseHandler(r)

	http.ListenAndServe(config.host, n)
}
