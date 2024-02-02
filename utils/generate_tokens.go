package utils

import (
	"os"
	"time"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("ACCESS_TOKEN_SECRET"))

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
	return token.SignedString(jwtSecret)
}

func GenerateRefreshToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"Subject":   fmt.Sprintf("%d", userId),
		"ExpiresAt": time.Now().Add(time.Hour * 24 * 30).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtSecret)

}
