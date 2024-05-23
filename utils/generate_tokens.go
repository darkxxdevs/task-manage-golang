package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var JwtSecret = []byte(os.Getenv("ACCESS_TOKEN_SECRET"))

type CustomClaims struct {
	UserId uuid.UUID `json:"_id"`
	Email  string    `json:"email"`
	jwt.MapClaims
}

func GenerateAccessToken(userID uuid.UUID, email string) (string, error) {
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

func GenerateRefreshToken(userId uuid.UUID) (string, error) {
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

func RefereshAccessToken(refreshToken string) ([]string, error) {

	claims, err := DecodeToken(refreshToken)

	if err != nil {
		return nil, err
	}

	newAccessToken, err := GenerateAccessToken(claims.UserId, claims.Email)

	if err != nil {
		return nil, err
	}

	newRefreshToken, err := GenerateRefreshToken(claims.UserId)

	if err != nil {
		return nil, err
	}

	return []string{newAccessToken, newRefreshToken}, nil

}
