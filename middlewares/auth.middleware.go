package middlewares

import (
	"fmt"
	"github.com/darkxxdevs/task-manager-api-go/controllers"
	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, source, err := ExtractToken(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request! Token not found",
				"status":  "error",
				"err":     err.Error(),
			})
			return
		}

		var details *utils.CustomClaims

		if source == "header" {
			details, err = utils.DecodeTokenAuthorization(token)

			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"message": "Invalid unauthorized request! Token verification failed",
					"status":  "error",
					"err":     err.Error(),
				})
				return
			}

			if err := details.Valid(); err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"message": "Unauthorized request! Token has expired",
					"status":  "error",
				})
				return
			}
		}

		details, err = utils.DecodeTokenAuthorization(token)

		if err != nil {

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request! Token verification failed",
				"status":  "error",
				"err":     err.Error(),
			})
			return

		}

		if err := details.Valid(); err != nil {
			fmt.Println(err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Unauthorized request! Token has expired",
				"status":  "error",
			})
			return
		}

		user := GetUserById(details.UserId)

		if user == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request! User not found",
				"status":  "error",
			})
			return
		}

		c.Set("user", user)

		c.Next()

	}
}

func ExtractToken(c *gin.Context) (string, string, error) {
	authHeader := c.GetHeader("Authorization")

	if authHeader != "" {

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return "", "", fmt.Errorf("invalid Authorization header format")
		}

		return parts[1], "header", nil

	}

	accessTokenString, err := c.Cookie("access_token")

	if err != nil {
		return "", "", fmt.Errorf("no access token found")
	}

	return accessTokenString, "cookie", nil
}

func GetUserById(userId uuid.UUID) *controllers.UserApiResponse {

	cont := controllers.NewUserController(db.DbConnection)

	return cont.GetUserByID(userId)
}
