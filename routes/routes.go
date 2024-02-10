package routes

import (
	"net/http"

	"github.com/darkxxdevs/task-manager-api-go/controllers"
	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {

	//load api groups
	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Api is live!",
		})
	})

	RegisterApiGroups(router)

}

func RegisterApiGroups(router *gin.Engine) {
	// controller instances
	userController := controllers.NewUserController(db.DbConnection)
	taskController := controllers.NewTaskController(db.DbConnection)

	// APi Group
	apiGroup := router.Group("/api/v1")
	{
		apiGroup.POST("/auth/signup", middlewares.HandleAssetUpload(), userController.RegisterUser)
		apiGroup.POST("/auth/login", userController.LoginUser)
		apiGroup.POST("/auth/logout", userController.Logout)

		// protected routes
		apiGroup.PATCH("/u/details", middlewares.AuthMiddleware(), userController.UpdateUserDetails)
		apiGroup.PATCH("/r/password", middlewares.AuthMiddleware(), userController.ResetPassword)

	}
	{
		apiGroup.POST("/tasks", middlewares.AuthMiddleware(), taskController.CreateTask)
		apiGroup.PATCH("/tasks", middlewares.AuthMiddleware(), taskController.UpdateTask)

	}

}
