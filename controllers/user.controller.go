package controllers

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/darkxxdevs/task-manager-api-go/models"
	"github.com/darkxxdevs/task-manager-api-go/utils"
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
	username, email, password := ctx.PostForm("username"), ctx.PostForm("email"), ctx.PostForm("password")

	if strings.Trim(username, "") == "" || strings.Trim(email, "") == "" || strings.Trim(password, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "credentials cannot be empty!",
		})
		return
	}

	result := u.DB.Create(&models.User{
		Username: username,
		Email:    email,
		Password: password,
	})

	if err := result.Error; err != nil {
		log.Fatal("[Error] while creating user" + err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"message": "Internal server error occured...",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Account created successfully!",
		"status":  "success",
	})

}

func (u *UserController) LoginUser(ctx *gin.Context) {
	email, password := ctx.PostForm("email"), ctx.PostForm("password")

	if strings.Trim(email, "") == "" || strings.Trim(password, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Credentials cannot be empty!",
			"status":  "error",
		})
		return
	}

	var user models.User

	result := u.DB.Where("email=?", email).First(&user)

	if errors := result.Error; errors != nil {
		if errors == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "User not found!",
				"status":  "error",
			})
		}
		return
	}

	if err := user.ComparePassword(password); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Incorrect password!",
			"status":  "error",
		})
		return
	}

	accessToken, err := utils.GenerateAccessToken(user.ID, email)

	if err != nil {
		log.Fatalf("[Error] while generating accessToken %+v", err.Error())
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID)

	if err != nil {
		log.Fatalf("[Error] while generating refreshToken %+v", err.Error())
		return
	}

	ctx.SetCookie("access_token", accessToken, int(time.Hour*2), "/", "", false, true)

	ctx.SetCookie("refresh_token", refreshToken, 2592000, "/", "", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successful!",
		"status":  "success",
	})
}
