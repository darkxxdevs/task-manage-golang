package db

import (
	"log"
	"os"
	"sync"

	"github.com/darkxxdevs/task-manager-api-go/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DbConnection *gorm.DB
	once         sync.Once
)

func Init() error {
	dsn := os.Getenv("DB_DSN")

	var err error
	once.Do(func() {
		DbConnection, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("[Error] while initializing the database connection..", err)
		}

		if err := utils.AutoMigrateModels(DbConnection); err != nil {
			log.Fatal("[Error] while migrating models to the database..", err)
		}
	})

	return err
}
