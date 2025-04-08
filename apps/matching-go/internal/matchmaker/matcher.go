package matchmaker

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"matching/internal/db"

	"github.com/go-redis/redis/v8"
)

// Add user to Redis sorted set
func addUserToQueue(userID string, rating int) {
	err := db.RedisClient.ZAdd(context.Background(), "matchmaking_queue", &redis.Z{
		Score:  float64(rating),
		Member: userID,
	}).Err()
	if err != nil {
		log.Fatalf("Error adding user to queue: %v", userID)
	}
	fmt.Printf("User %s added with rating %d\n", userID, rating)
}

// Find match for a user
func FindMatch(userID string, rating int) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	addUserToQueue(userID, rating)

	minRating := rating - 2
	maxRating := rating + 2
	matchChannel := "match_" + userID // Unique Redis Pub/Sub channel for this user

	// Subscribe to the match channel for real-time updates
	pubsub := db.RedisClient.Subscribe(ctx, matchChannel)
	defer pubsub.Close()

	// Try to match the user
	go attemptMatch(ctx, userID, minRating, maxRating)

	// Listen for real-time match updates
	for {
		select {
		case <-ctx.Done():
			db.RedisClient.ZRem(ctx, "matchmaking_queue", userID)
			return "", fmt.Errorf("matching timeout after 20 seconds")

		case msg := <-pubsub.Channel():
			// Match found, return the matched user ID
			fmt.Println("message payload", msg.Payload)

			return msg.Payload, nil
		}
	}
}

// Try to find a match and notify both users
func attemptMatch(ctx context.Context, userID string, minRating, maxRating int) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			// Search for a matching user
			matches, err := db.RedisClient.ZRangeByScore(ctx, "matchmaking_queue", &redis.ZRangeBy{
				Min: strconv.Itoa(minRating),
				Max: strconv.Itoa(maxRating),
			}).Result()
			if err != nil {
				log.Printf("Error finding matches: %v", err)
				continue
			}

			for _, match := range matches {
				if match != userID {
					// Remove both users from queue
					db.RedisClient.ZRem(ctx, "matchmaking_queue", userID)
					db.RedisClient.ZRem(ctx, "matchmaking_queue", match)

					// Notify both users about the match
					db.RedisClient.Publish(ctx, "match_"+userID, match)
					db.RedisClient.Publish(ctx, "match_"+match, userID)
					return
				}
			}
		}
	}
}

func RemoveUser(userID string) error {
	db.RedisClient.ZRem(context.Background(), "matchmaking_queue", userID)
	return nil
}
