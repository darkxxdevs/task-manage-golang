package main

import (
	"fmt"
	"github.com/darkxxdevs/task-manager-api-go/db"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatal("[Error] while loading environment variables:::", err)
	}

	router := gin.Default()

	if err := db.Init(); err != nil {
		log.Fatal("[Error] while initializing database connection", err)
	}

	fmt.Printf("[Success] successfully initialized database connection!")

	if err := router.Run(":8000"); err != nil {
		log.Fatal("[Error] while starting up the server", err)
	}

}
