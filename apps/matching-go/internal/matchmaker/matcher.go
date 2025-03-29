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

func addUserToQueue(userID string, rating int) {
	err := db.RedisClient.ZAdd(context.Background(), "matchmaking_queue", &redis.Z{
		Score:  float64(rating),
		Member: userID,
	}).Err()
	if err != nil {
		log.Fatalf("Error adding user to the queue: %v", userID)
	}

	fmt.Printf("user %s added with rating %d\n", userID, rating)
}

func FindMatch(userID string, rating int) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	addUserToQueue(userID, rating)
	minRating := rating - 2
	maxRating := rating + 2

	// Create a ticker to check for matches every 2 seconds
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		// <-ch we are receiving from the channel
		case <-ctx.Done():
			// Remove user from queue if timeout occurs
			db.RedisClient.ZRem(context.Background(), "matchmaking_queue", userID)
			return "", fmt.Errorf("matching timeout after 60 seconds")
		case <-ticker.C:
			matches, err := db.RedisClient.ZRangeByScore(ctx, "matchmaking_queue", &redis.ZRangeBy{
				Min:   strconv.Itoa(minRating),
				Max:   strconv.Itoa(maxRating),
				Count: 10,
			}).Result()
			if err != nil {
				log.Printf("Error finding matches: %v", err)
				continue
			}

			var matchUserID string
			for _, match := range matches {
				if match != userID {
					matchUserID = match
					break
				}
			}

			if matchUserID != "" {
				// Remove both users from the queue
				db.RedisClient.ZRem(context.Background(), "matchmaking_queue", userID)
				db.RedisClient.ZRem(context.Background(), "matchmaking_queue", matchUserID)
				return matchUserID, nil
			}
		}
	}
}
