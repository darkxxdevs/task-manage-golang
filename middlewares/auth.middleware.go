package middlewares

import (
	"github.com/darkxxdevs/task-manager-api-go/controllers"
	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("access_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized request!",
				"status":  "error",
			})
			return
		}

		cont := controllers.NewUserController(db.DbConnection)

		details, err := utils.DecodeToken(cookie)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request!",
				"status":  "error",
				"err":     err.Error(),
			})
			return
		}

		user := cont.GetUserByID(details.UserId)

		if user == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request!",
				"status":  "error",
			})
			return
		}

		c.Set("user", user)

		c.Next()

	}

}
