package main

import (
	"fmt"

	"matching/config"
	"matching/internal/api"
	"matching/internal/db"
)

func main() {
	db.ConnectDB()
	config.LoadEnv()
	db.InitRedis()
	db.InitKafka()
	// go matchmaker.StartConsumer()
	api.StartServer()
	fmt.Println(" Matching Service is running...")
}
