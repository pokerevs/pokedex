package db

import (
	"log"

	"gopkg.in/mgo.v2"
)

type Datastore struct {
	session *mgo.Session
}

var dbSession *mgo.Session

func InitConnection(dbUrl string) {
	var err error
	dbSession, err = mgo.Dial(dbUrl)
	if err != nil {
		log.Fatal("Error connecting to db: ", err)
	}
	dbSession.SetMode(mgo.Eventual, true)
}

func GetSession() *mgo.Session {
	return dbSession;
}

func GetDatastore() *Datastore {
	return &Datastore{dbSession.Copy()}
}