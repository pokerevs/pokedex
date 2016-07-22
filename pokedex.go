package main

import (
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"

	"github.com/gorilla/mux"
	// "github.com/gorilla/context"
	"github.com/urfave/negroni"
	"github.com/auth0/go-jwt-middleware"

	"github.com/pokerevs/pokedex/api"
)

func main() {
	log.Print("Welcome to Pokédex. Gotta OH FUCK THAT SHOULD HAVE WORKED them all!")

	config, e := LoadConfigFromEnvironment()
	if e != nil {
		log.Fatal("Error loading config: ", e)
	}

	r := mux.NewRouter()

	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options {
		ValidationKeyGetter: func (token *jwt.Token) (interface{}, error) {
			return []byte(config.jwt_secret), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})
	n := negroni.New(negroni.NewLogger(), negroni.NewRecovery())

	apiRouter := r.PathPrefix("/api").Subrouter()
	{
		apiRouter.Handle("/push/mapobject", negroni.New(
			negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
			negroni.Wrap(http.HandlerFunc(api.PushMapobject)),
		))
		apiRouter.Handle("/push/mapobject/bulk", negroni.New(
			negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
			negroni.Wrap(http.HandlerFunc(api.BulkPushMapobjects)),
		))

		apiRouter.HandleFunc("/mapobject/bbox", api.GetMapBbox)
	}

	n.UseHandler(r)

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(config.host, n))
}
