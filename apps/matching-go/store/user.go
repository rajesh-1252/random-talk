package store

import (
	"context"
	"fmt"

	"matching/types"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

const collection = "users"

type Dropper interface {
	Drop(ctx context.Context) error
}
type UserStore interface {
	GetUserByID(context.Context, string) (*types.User, error)
	Dropper
}

type MongoUserStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoUserStore(client *mongo.Client, dbName string) *MongoUserStore {
	return &MongoUserStore{
		client: client,
		coll:   client.Database(dbName).Collection(collection),
	}
}

func (s *MongoUserStore) GetUserByID(ctx context.Context, userID string) (*types.User, error) {
	oid, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid ObjectID: %v", err)
	}

	fmt.Println("Converted ObjectID:", oid)

	var user types.User
	if err := s.coll.FindOne(ctx, bson.M{"_id": oid}).Decode(&user); err != nil {
		return nil, err
	}

	fmt.Println("Retrieved User:", user)
	return &user, nil
}

func (s *MongoUserStore) Drop(ctx context.Context) error {
	return s.coll.Drop(ctx)
}
