package main

import (
	"fmt"
	"log"
	"os"

	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/middlewares"
	"github.com/darkxxdevs/task-manager-api-go/routes"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
)

func main() {

	utils.LoadEnvVariables()

	if err := db.Init(); err != nil {
		log.Fatal("[Error] while initializing database connection", err)
	}

	fmt.Println("[Success] successfully initialized database connection!")

	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	router.Use(middlewares.CorsMiddleware())

	routes.RegisterRoutes(router)

	if err := router.Run(os.Getenv("SERVER_PORT")); err != nil {
		log.Fatal("[Error] while starting up the server", err)
	}

}
