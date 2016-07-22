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
	jwtclaims := context.Get(r, "user").(*jwt.Token).Claims.(jwt.MapClaims)

	log.Print("Authenticating user:");
	log.Print("\tuser id: ", jwtclaims["id"])
	user, err := ds.GetUserById(jwtclaims["id"].(string))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	log.Print("\tusername: ", user.Username, "<", user.FqName, 
}

func BulkPushMapobjects(w http.ResponseWriter, r *http.Request) {
}

func GetMapBbox(w http.ResponseWriter, r *http.Request) {
}