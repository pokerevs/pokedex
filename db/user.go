package db

import (
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	Username string
	FqName string
	
	Roles []string
}

func (u User) DoesUserPossessRole(role string) bool {
	for _, v := range u.Roles {
		if v == role {
			return true
		}
	}
	return false
}

func (ds *Datastore) GetUserById(id string) (User, error) {
	users := ds.session.DB("").C("users")
	u := User{}
	err := users.FindId(bson.ObjectIdHex(id)).One(&u)
	return u, err
}

func (ds *Datastore) HttpAuthUserFromJwt(w http.ResponseWriter, token *jwt.Token) User {
	jwtclaims := token.Claims.(jwt.MapClaims)
	log.Print("Authenticating user:");
	log.Print("\tuser id: ", jwtclaims["id"])
	user, err := ds.GetUserById(jwtclaims["id"].(string))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	log.Print("\tusername: ", user.Username, " <", user.FqName, ">")
	log.Print("\troles: ", user.Roles)
	return user
}