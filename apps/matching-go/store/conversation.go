package store

import (
	"context"
	"fmt"
	"time"

	"matching/types"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ConversationStore interface {
	InsertConversation(ctx context.Context, userOneID, userTwoID string) (*types.Conversation, error)
}

type MongoConversationStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoConversationStore(client *mongo.Client, dbName string) *MongoConversationStore {
	return &MongoConversationStore{
		client: client,
		coll:   client.Database(dbName).Collection("conversations"),
	}
}

func (h *MongoConversationStore) InsertConversation(ctx context.Context, userOneID, userTwoID string) (*types.Conversation, error) {
	userOneObjID, err := bson.ObjectIDFromHex(userOneID)
	if err != nil {
		return nil, fmt.Errorf("invalid userOneID: %v", err)
	}
	userTwoObjID, err := bson.ObjectIDFromHex(userTwoID)
	if err != nil {
		fmt.Printf("invalid userTwoID: %v", err)
	}

	fmt.Println("user 1 id ", userOneObjID, "user 2 id", userTwoObjID)

	// Check if conversation already exists
	filter := bson.M{
		"participants": bson.M{"$all": []bson.ObjectID{userOneObjID, userTwoObjID}},
		"isGroup":      false,
	}
	var existing types.Conversation

	err = h.coll.FindOne(ctx, filter).Decode(&existing)
	fmt.Println(existing, "existing", err)
	if err == nil {
		fmt.Println("Conversation already exists:", existing.ID)
		return nil, err
	}
	if err != mongo.ErrNoDocuments {
		return nil, fmt.Errorf("failed to check conversation existence: %v", err)
	}

	// Create new conversation
	conversation := types.Conversation{
		Participants: []bson.ObjectID{userOneObjID, userTwoObjID},
		IsGroup:      false,
		UnreadCount:  map[string]int{},
		IsPinned:     map[string]bool{},
		IsMuted:      map[string]bool{},
		Archived:     map[string]bool{},
		DeletedFor:   []bson.ObjectID{},
		TypingUsers:  []bson.ObjectID{},
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	res, err := h.coll.InsertOne(ctx, conversation)
	if err != nil {
		return nil, fmt.Errorf("failed to insert conversation: %v", err)
	}

	fmt.Println("Inserted conversation:", res.InsertedID)
	return &conversation, nil
}
