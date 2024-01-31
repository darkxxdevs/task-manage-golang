package utils

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {

	if err := godotenv.Load(); err != nil {
		log.Fatal("[Error] while loading environment variables:::", err)
	}

}
