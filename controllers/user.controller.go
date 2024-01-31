package controllers

import (
	"log"
	"net/http"
	"strings"

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
	username := ctx.PostForm("username")
	email := ctx.PostForm("email")
	password := ctx.PostForm("password")

	log.Println("credentials recieved:", email, password, username)

	if strings.Trim(username, "") == "" || strings.Trim(email, "") == "" || strings.Trim(password, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "credentials cannot be empty!",
		})
		return
	}

	log.Println("Creating user instance ...")

	newUser := models.User{
		Username: username,
		Email:    email,
		Password: password,
	}

	log.Println("Created user instance ...")

	log.Printf("New User: %+v", newUser)

	result := u.DB

	log.Printf("db config:: %+v", result)

	if err := result.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Internal server error occured...",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Account created successfully!",
	})

}

func (u *UserController) LoginUser(ctx *gin.Context) {
	var loginInput struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&loginInput); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var user models.User

	if err := u.DB.Where("email=?", loginInput.Email).First(&user).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	if err := user.ComparePassword(loginInput.Password); err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
	})
}
