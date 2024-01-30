package utils

import (
	"github.com/darkxxdevs/task-manager-api-go/models"
	"gorm.io/gorm"
)

func AutoMigrateModels(db *gorm.DB) error {

	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Task{},
	}

	return db.AutoMigrate(modelsToMigrate...)
}
