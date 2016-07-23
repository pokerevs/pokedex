package api

import (
	"log"
	"net/http"

	"github.com/gorilla/context"
	"github.com/dgrijalva/jwt-go"

	"github.com/pokerevs/pokedex/db"
)

func PushMapobject(w http.ResponseWriter, r *http.Request) {
	ds := db.GetDatastore()
	user := ds.HttpAuthUserFromJwt(w, context.Get(r, "user").(*jwt.Token))
	log.Print(user)
}

func BulkPushMapobjects(w http.ResponseWriter, r *http.Request) {
}

func GetMapBbox(w http.ResponseWriter, r *http.Request) {
}