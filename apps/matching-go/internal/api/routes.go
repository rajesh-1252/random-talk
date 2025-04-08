package api

import (
	"os"

	"matching/middleware"
	"matching/routes"

	"github.com/gin-gonic/gin"
)

func StartServer() {
	router := gin.Default()

	router.Use(middleware.JWTMiddleware())

	v1 := router.Group("/api")
	routes.ConversationRoute(v1.Group("/conversation"))
	router.GET("/find-match", FindMatchHandler)
	router.GET("/cancel-match", FindMatchHandler)
	router.Run(":" + os.Getenv("PORT"))
}
