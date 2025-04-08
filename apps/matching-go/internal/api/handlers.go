package api

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"matching/handlers"
	"matching/internal/db"
	"matching/internal/matchmaker"
	"matching/store"
	"matching/types"

	"github.com/gin-gonic/gin"
)

func FindMatchHandler(c *gin.Context) {
	rating, ratingExists := c.Get("rating")
	userID, userExists := c.Get("userId")
	if !userExists || !ratingExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user data"})
		return
	}
	userIDStr, ok1 := userID.(string)
	ratingInt, ok2 := rating.(int)
	if !ok1 || !ok2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user data format"})
		return
	}

	matchUserID, err := matchmaker.FindMatch(userIDStr, ratingInt)
	if err != nil {
		fmt.Println(err, "printing error")
		if err.Error() == "matching timeout after 60 seconds" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "No match found within 60 seconds",
				"status":  "timeout",
			})
			return
		}
		log.Printf("Error finding match: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	userDetails, err := GetUserByID(c, matchUserID)
	if err != nil {
		log.Fatal("error fetching user Details", err)
	}
	fmt.Println("matchUserId print", matchUserID)
	// fmt.Println("userDetails print", userDetails)

	c.JSON(http.StatusOK, gin.H{
		"message": "Match found",
		"result":  userDetails,
		"status":  "success",
	})
}

func CancelMatchHandler(c *gin.Context) {
	userID, userExists := c.Get("userId")
	if !userExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user data"})
		return
	}
	userIDStr, ok1 := userID.(string)
	if !ok1 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user data format",
		})
	}
	matchmaker.RemoveUser(userIDStr)
}

func GetUserByID(ctx context.Context, userID string) (*types.User, error) {
	// var user types.User
	client := db.MongoClient

	userStore := store.NewMongoUserStore(client, store.DBNAME)

	userHandler := handlers.NewUserHandler(userStore)
	user, err := userHandler.GetUserByID(userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}
