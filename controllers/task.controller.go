package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/darkxxdevs/task-manager-api-go/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaskController struct {
	DB *gorm.DB
}

type TaskApiResponse struct {
	ID          uuid.UUID `json:"_id"`
	Title       string    `json:"title"`
	Desc        string    `json:"description"`
	IdEdited    bool      `json:"is_edited"`
	IsCompleted bool      `json:"is_completed"`
	UserID      uuid.UUID `json:"created_by"`
}

func NewTaskController(dbConnection *gorm.DB) *TaskController {
	return &TaskController{DB: dbConnection}
}

func (t *TaskController) CreateTask(ctx *gin.Context) {
	title, description := ctx.PostForm("title"), ctx.PostForm("description")

	if strings.Trim(title, "") == "" || strings.Trim(description, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Both title and description are required!",
			"status":  "error",
		})
	}

	user, ok := ctx.Get("user")
	if !ok {
		fmt.Println("[Error] User object not found in Context")
		return
	}

	userConv, ok := user.(*UserApiResponse)
	if !ok {
		fmt.Println("[Error] Invalid object  found in Context")
		return
	}

	newTask := models.Task{
		Title:       title,
		Descrpition: description,
		UserID:      userConv.ID,
	}

	response := t.DB.Create(&newTask)

	if err := response.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  "error",
		})
		return
	}

	apiResponse := TaskApiResponse{
		ID:          newTask.ID,
		Title:       newTask.Title,
		Desc:        newTask.Descrpition,
		IdEdited:    newTask.IsEdited,
		IsCompleted: newTask.IsCompleted,
		UserID:      newTask.UserID,
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "task created successfully!",
		"status":       "success",
		"created_task": apiResponse,
	})
}
