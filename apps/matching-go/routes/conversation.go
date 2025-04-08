package routes

import (
	"matching/handlers"
	"matching/internal/db"
	"matching/store"

	"github.com/gin-gonic/gin"
)

var (
	conversationStore   *store.MongoConversationStore
	conversationHandler *handlers.ConversationHandler
)

func init() {
}

func ConversationRoute(router *gin.RouterGroup) {
	client := db.MongoClient
	if client == nil {
		panic("MongoClient is nil. Make sure MongoDB is initialized before using routes.")
	}
	conversationStore = store.NewMongoConversationStore(client, "voice-chat")
	conversationHandler = handlers.NewConversationHander(conversationStore)
	router.GET("/", conversationHandler.CreateConversation)
}
