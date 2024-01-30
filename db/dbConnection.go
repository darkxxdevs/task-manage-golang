package db

import (
	"log"
	"os"

	"github.com/darkxxdevs/task-manager-api-go/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DbConnection *gorm.DB

func Init() (err error) {
	dsn := os.Getenv("DB_DSN")

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	if err := utils.AutoMigrateModels(db); err != nil {
		log.Fatal("[Error] while mograting models to database...", err)
	}

	DbConnection = db

	return nil
}
