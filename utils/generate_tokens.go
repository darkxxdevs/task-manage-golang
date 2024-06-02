package utils

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var jwtSecret = []byte(os.Getenv("ACCESS_TOKEN_SECRET"))

type StandardClaims struct {
	Subject   string `json:"sub"`
	ExpiresAt int64  `json:"exp"`
	IssuedAt  int64  `json:"iat"`
	NotBefore int64  `json:"nbf"`
	Issuer    string `json:"iss"`
	Audience  string `json:"aud"`
	ID        string `json:"jti"`
}

type CustomClaims struct {
	UserId uuid.UUID `json:"_id"`
	Email  string    `json:"email"`
	StandardClaims
}

func (c *CustomClaims) Valid() error {
	now := time.Now().Unix()

	if now > c.ExpiresAt {
		return fmt.Errorf("token has expired")
	}

	return nil
}

func (c *CustomClaims) GetAudience() (jwt.ClaimStrings, error) {
	return jwt.ClaimStrings{c.Audience}, nil
}

func GenerateToken(userID uuid.UUID, email string) (string, error) {
	now := time.Now()
	claims := CustomClaims{
		UserId: userID,
		Email:  email,
		StandardClaims: StandardClaims{
			Subject:   userID.String(),
			ExpiresAt: now.Add(time.Hour * 2).Unix(),
			IssuedAt:  now.Unix(),
			NotBefore: now.Unix(),
			Issuer:    "organico",
			Audience:  "general",
			ID:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)

	return token.SignedString(jwtSecret)
}

func DecodeTokenAuthorization(token string) (*CustomClaims, error) {
	claims := &CustomClaims{}

	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("[error]:invalid jwt-format encounrtered while decoding")
	}

	payloadBytes, err := decodeBase64(parts[1])
	if err != nil {
		return nil, fmt.Errorf("error decoding payloadBytes : %v", err)
	}

	if err := json.Unmarshal(payloadBytes, claims); err != nil {
		return nil, fmt.Errorf("error unmarshaling payload: %v", err)
	}

	return claims, nil
}

func DecodeToken(tokenString string) (*CustomClaims, error) {
	claims := &CustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("error decoding token: %v", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("token is not valid")
	}

	return claims, nil
}

func decodeBase64(input string) ([]byte, error) {
	return base64.RawURLEncoding.DecodeString(input)
}

func RefreshAccessToken(refreshToken string) ([]string, error) {
	claims, err := DecodeToken(refreshToken)

	if err != nil {
		return nil, err
	}

	newAccessToken, err := GenerateToken(claims.UserId, claims.Email)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := GenerateToken(claims.UserId, claims.Email)

	if err != nil {
		return nil, err
	}

	return []string{newAccessToken, newRefreshToken}, nil

}

func (s StandardClaims) GetSubject() (string, error) {
	return s.Subject, nil
}

func (s StandardClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(s.IssuedAt, 0)), nil
}

func (s StandardClaims) GetNotBefore() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(s.NotBefore, 0)), nil
}

func (s StandardClaims) GetID() string {
	return s.ID
}

func (s StandardClaims) GetIssuer() (string, error) {
	return s.Issuer, nil
}
func (s StandardClaims) GetAudience() (jwt.ClaimStrings, error) {
	return jwt.ClaimStrings{s.Audience}, nil
}

func (s StandardClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(s.ExpiresAt, 0)), nil
}
