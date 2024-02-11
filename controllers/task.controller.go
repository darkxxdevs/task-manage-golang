package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/darkxxdevs/task-manager-api-go/models"
	"github.com/darkxxdevs/task-manager-api-go/utils"
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

func (t *TaskController) UpdateTask(ctx *gin.Context) {
	newTitle, newDescrption := ctx.PostForm("newTitle"), ctx.PostForm("desc")

	if strings.Trim(newTitle, "") == "" && strings.Trim(newDescrption, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Atleast one of new title or description is required!",
			"state":   "error",
		})
		return
	}

	params := ctx.Request.URL.Query()

	var updatedTask models.Task

	taskIdSlice, ok := params["taskId"]
	if !ok {
		fmt.Println("[Error] taskId key not found")
		return
	}

	if len(taskIdSlice) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Task id is required!",
			"status":  "error",
		})
		return
	}

	taskId := strings.Trim(taskIdSlice[0], "")

	uuid, err := utils.StringtoUuid(taskId)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid uuid format!",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	updatedTask.ID = uuid

	if strings.Trim(newTitle, "") != "" {
		updatedTask.Title = newTitle
	}

	if strings.Trim(newDescrption, "") != "" {
		updatedTask.Descrpition = newDescrption
	}

	updatedTask.IsEdited = true

	var existingTask models.Task

	result := t.DB.Where("id = ? ", uuid).First(&existingTask)

	if errors := result.Error; errors != nil {
		if errors == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "Task not found!",
				"status":  "error",
			})
		}
		return
	}

	updateQueryResult := t.DB.Model(&existingTask).Updates(&updatedTask)

	if err := updateQueryResult.Error; err != nil {
		fmt.Printf("[Error] task update failed ! %v", err.Error())
		return
	}

	apiResponse := TaskApiResponse{
		ID:          updatedTask.ID,
		Title:       updatedTask.Title,
		Desc:        updatedTask.Descrpition,
		IdEdited:    updatedTask.IsEdited,
		IsCompleted: updatedTask.IsCompleted,
		UserID:      existingTask.UserID,
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "Task update successful",
		"status":       "success",
		"updated task": apiResponse,
	})
}

func (t *TaskController) GetAllTaks(ctx *gin.Context) {

	user, ok := ctx.Get("user")
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "user not found!",
			"status":  "error",
		})
	}

	parsedUser, ok := user.(*UserApiResponse)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invaild User!",
			"status":  "error",
		})
		return
	}

	var tasks []models.Task

	response := t.DB.Where("user_id=?", parsedUser.ID).Find(&tasks)

	if err := response.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"tasks":   tasks,
		"message": "successfully fetched user tasks!",
		"status":  "success",
	})

}

func (t *TaskController) ToggleCompleteStatus(ctx *gin.Context) {

	params := ctx.Request.URL.Query()

	taskIdSlice, ok := params["taskId"]

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "No query params were found!",
			"status":  "error",
		})
		return
	}

	if len(taskIdSlice) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Empty params collection found!",
			"status":  "error",
		})
		return
	}

	taskId := strings.Trim(taskIdSlice[0], "")

	var task models.Task

	response := t.DB.Where("id=?", taskId).First(&task)

	if err := response.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  "error",
		})
		return
	}

	task.IsCompleted = !task.IsCompleted

	result := t.DB.Model(&task).Update("is_completed", task.IsCompleted)

	if err := result.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "task completion status updated successfully",
		"status":       "success",
		"updated_task": task,
	})

}
