package handlers

import (
	"context"
	"net/http"

	"matching/store"

	"github.com/gin-gonic/gin"
)

type ConversationHandler struct {
	conversationStore store.ConversationStore
}

func NewConversationHander(conversationStore store.ConversationStore) *ConversationHandler {
	return &ConversationHandler{
		conversationStore: conversationStore,
	}
}

func (ch *ConversationHandler) CreateConversation(c *gin.Context) {
	ctx := context.TODO()
	userID, userExists := c.Get("userId")
	if !userExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user data"})
		return
	}
	userIDStr, ok1 := userID.(string)
	if !ok1 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user data format"})
		return
	}
	matchID := c.Query("matchId")
	if matchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userTwoID is required"})
		return
	}
	user, err := ch.conversationStore.InsertConversation(ctx, userIDStr, matchID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Error",
			"result":  nil,
			"status":  "failure",
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user fond",
		"result":  user,
		"status":  "success",
	})
}
