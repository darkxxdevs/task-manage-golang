package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAuthenticated := false

		if isAuthenticated && strings.HasPrefix(c.Request.URL.Path, "/login") || strings.HasPrefix(c.Request.URL.Path, "/signup") {
			c.Redirect(http.StatusTemporaryRedirect, "/")
			return
		}

		if !isAuthenticated {
			c.Redirect(http.StatusTemporaryRedirect, "/login")
			c.Abort()
		}

	}

}
