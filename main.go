package main

import (
	"fmt"
	"log"

	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/darkxxdevs/task-manager-api-go/routes"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
)

func main() {

	utils.LoadEnvVariables()

	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	routes.RegisterRoutes(router)

	if err := db.Init(); err != nil {
		log.Fatal("[Error] while initializing database connection", err)
	}

	fmt.Println("[Success] successfully initialized database connection!")

	if err := router.Run(":8000"); err != nil {
		log.Fatal("[Error] while starting up the server", err)
	}

}
