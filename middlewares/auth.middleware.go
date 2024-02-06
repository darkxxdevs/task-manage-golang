package middlewares

import (
	"fmt"
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
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "failed to retrive cookie",
				"status":  "error",
			})
			c.Abort()
		}
		cont := controllers.NewUserController(db.DbConnection)

		details, err := utils.DecodeToken(cookie)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid unauthorized request!",
				"status":  "error",
				"err":     err.Error(),
			})
			c.Abort()
		}

		user := cont.GetUserByEmail(details.Email)

		fmt.Println(user)

		c.Set("user", user)

		c.Abort()

	}

}
