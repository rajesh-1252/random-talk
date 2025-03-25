package matchmaker

import (
	"context"
	"fmt"
	"log"
	"strconv"

	"matching/internal/db"
)

func StartConsumer() {
	reader := db.GetKafkaReader(db.MatchMakingTopic)
	defer reader.Close()

	fmt.Println("Listening for match making request")
	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Fatalf("Kafka read error: %v", err)
		}

		userID := string(msg.Key)
		rating := string(msg.Value)

		fmt.Printf("Received Request: %s (rating: %s)\n", userID, rating)
		ratingInt, err := strconv.Atoi(rating) // Convert string to int
		if err != nil {
			log.Fatalf("❌ Invalid rating: %v", err)
		}
		match, err := FindMatch(userID, ratingInt)
		if err == nil {
			PublishMatch(userID, match)
		}

	}
}
