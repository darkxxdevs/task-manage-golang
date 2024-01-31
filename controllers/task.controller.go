package controllers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskController struct {
	DB *gorm.DB
}

func NewTaskController(dbConnection *gorm.DB) *TaskController {
	return &TaskController{DB: dbConnection}

}

func (t *TaskController) GetAllTasks(ctx *gin.Context) {

}
