package matchmaker

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"matching/internal/db"

	"github.com/segmentio/kafka-go"
)

type MatchEvent struct {
	Type      string `json:"type"`
	User1ID   string `json:"user1Id"`
	User2ID   string `json:"user2Id"`
	Timestamp int64  `json:"timestamp"`
}

func PublishMatch(user1, user2 string) {
	writer := db.GetKafkaWriter(db.MatchMakingTopic)
	defer writer.Close()

	// Create match event
	matchEvent := MatchEvent{
		Type:      "match_found",
		User1ID:   user1,
		User2ID:   user2,
		Timestamp: time.Now().Unix(),
	}

	// Convert to JSON
	eventJSON, err := json.Marshal(matchEvent)
	if err != nil {
		fmt.Printf("Failed to marshal match event: %v\n", err)
		return
	}

	// Publish to Kafka
	err = writer.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte(user1),
		Value: eventJSON,
	})
	if err != nil {
		fmt.Printf("Failed to publish match: %v\n", err)
	} else {
		fmt.Printf("Published match event: %s <-> %s\n", user1, user2)
	}

	// Also publish for user2
	err = writer.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte(user2),
		Value: eventJSON,
	})
	if err != nil {
		fmt.Printf("Failed to publish match for user2: %v\n", err)
	}
}
