package api

import (
	"log"
	"net/http"

	"matching/internal/matchmaker"

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
		if err.Error() == "matching timeout after 60 seconds" {
			c.JSON(http.StatusRequestTimeout, gin.H{
				"message": "No match found within 60 seconds",
				"status":  "timeout",
			})
			return
		}
		log.Printf("Error finding match: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Match found",
		"matchId": matchUserID,
		"status":  "success",
	})
}
