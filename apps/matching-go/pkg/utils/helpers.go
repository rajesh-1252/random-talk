package utils

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

var secretKey = os.Getenv("JWT_SECRET")

func ParseJWT(tokenString string) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		log.Println("Error parsing JWT:", err)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println("Decoded JWT claims:")
		for key, value := range claims {
			fmt.Printf("%s: %v\n", key, value)
		}
	} else {
		fmt.Println("Invalid JWT token")
	}
}
