package db

import (
	"log"
	"os"

	"github.com/segmentio/kafka-go"
)

const (
	MatchMakingTopic = "matchmaking_requests"
	MatchFound       = "match_found"
)

var (
	kafkaWriter *kafka.Writer
	kafkaReader *kafka.Reader
)

func InitKafka() {
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		log.Fatal("KAFKA_BROKER is not set in .env")
	}

	kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP(os.Getenv("KAFKA_BROKER")),
		Topic:    os.Getenv("KAFKA_MATCHMAKING_TOPIC"),
		Balancer: &kafka.LeastBytes{},
	}

	kafkaReader = kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{os.Getenv("KAFKA_BROKER")},
		Topic:    os.Getenv("KAFKA_MATCHMAKING_TOPIC"),
		GroupID:  "matching_group",
		MinBytes: 10e3,
		MaxBytes: 10e6,
	})
}

func GetKafkaWriter(topic string) *kafka.Writer {
	return kafkaWriter
}

func GetKafkaReader(topic string) *kafka.Reader {
	return kafkaReader
}
