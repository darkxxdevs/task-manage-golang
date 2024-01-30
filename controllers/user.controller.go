package controllers

import (
	"net/http"
	"github.com/darkxxdevs/task-manager-api-go/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(DBconnection *gorm.DB) *UserController {
	return &UserController{DB: DBconnection}
}

func (u *UserController) RegisterUser(ctx *gin.Context) {
	var userInput models.User

	if err := ctx.ShouldBindJSON(&userInput); err != nil {
		return ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body!"
		})
	}


	if err := userInput.Validate(); err != nil {
		return ctx.JSON(http.StatusBadRequest , gin.H{
			"Error": err.Error()
		})

	}

	newUser := models.User{
		Username: userInput.Username,
		Password: userInput.Password,
		Email: userInput.Email
	}

	result := u.DB.Create(&newUser)

	if result.Error != nil {
		return ctx.JSON(http.StatusInternalServerError , gin.H{
			"error":"Failed to create a new user!"
		})

	}
}
