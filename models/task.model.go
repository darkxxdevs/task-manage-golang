package models

import (
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	ID uuid.UUID `gorm:"primary_key;type:uuid"`
	gorm.Model
	Title       string `gorm:"not null"`
	Descrpition string
	IsCompleted bool      `gorm:"default:false"`
	IsEdited    bool      `gorm:"default:false"`
	UserID      uuid.UUID `gorm:"foreignKey:UserID"`
}

func (task *Task) BeforeSave(tx *gorm.DB) (err error) {

	if len(task.Title) > 100 {
		return errors.New("[Error]::title cannot be greater than 100 characters")
	}

	if len(task.Descrpition) > 1000 {
		return errors.New("[Error]::Descrpition cannot be greater that 1000 characters")
	}

	return nil
}
