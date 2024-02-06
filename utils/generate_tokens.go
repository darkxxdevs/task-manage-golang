package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JwtSecret = []byte(os.Getenv("ACCESS_TOKEN_SECRET"))

type CustomClaims struct {
	UserId uint   `json:"user_id"`
	Email  string `json:"email"`
	jwt.MapClaims
}

func GenerateAccessToken(userID uint, email string) (string, error) {
	claims := CustomClaims{
		UserId: userID,
		Email:  email,
		MapClaims: jwt.MapClaims{
			"ExpiresAt": time.Now().Add(time.Hour * 2).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JwtSecret)
}

func GenerateRefreshToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"Subject":   fmt.Sprintf("%d", userId),
		"ExpiresAt": time.Now().Add(time.Hour * 24 * 30).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(JwtSecret)

}

func DecodeToken(token string) (*CustomClaims, error) {

	claims := &CustomClaims{}

	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return JwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("error while decoding token %w", err)
	}

	return claims, nil

}
