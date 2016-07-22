package db

import (
	// "gopkg.in/mgo.v2"
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