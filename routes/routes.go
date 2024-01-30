package routes

import (
	"github.com/darkxxdevs/task-manager-api-go/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {

	router.GET("/api/v1/tasks", controllers.GetAllTask)

}
