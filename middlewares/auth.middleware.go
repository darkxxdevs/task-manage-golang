package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/darkxxdevs/task-manager-api-go/controllers"
	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized request! Authorization header is missing",
				"status":  "error",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Unauthorized request! Invalid Authorization header format",
				"status":  "error",
			})
			return
		}

		token := parts[1]

		details, err := utils.DecodeToken(token)

		fmt.Println("Details:", details)

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

		cont := controllers.NewUserController(db.DbConnection)

		user := cont.GetUserByID(details.UserId)
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
