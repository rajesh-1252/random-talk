package api

import (
	"os"

	"matching/middleware"

	"github.com/gin-gonic/gin"
)

func StartServer() {
	router := gin.Default()

	router.Use(middleware.JWTMiddleware())
	router.GET("/find-match", FindMatchHandler)
	router.Run(":" + os.Getenv("PORT"))
}
