package db

import (
	"fmt"
	"log"

	"matching/store"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var MongoClient *mongo.Client

func ConnectDB() {
	connectionStr := store.DBURI
	fmt.Println("connectionStr", connectionStr)
	clientOptions := options.Client().ApplyURI(connectionStr)
	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatal("Error connecting to db", err)
	}
	MongoClient = client

	// userStore := store.NewMongoUserStore(client, "user")
	// userHandler := handlers.NewUserHandler(userStore)
	fmt.Println("Connected to MongoDB!", client)
	// defer func() {
	// 	if err = client.Disconnect(ctx); err != nil {
	// 		panic(err)
	// 	}
	// }()
}
