package controllers

import (
	"log"
	"net/http"
	"strings"

	"github.com/darkxxdevs/task-manager-api-go/models"
	"github.com/darkxxdevs/task-manager-api-go/services"
	"github.com/darkxxdevs/task-manager-api-go/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

type UserApiResponse struct {
	ID             uuid.UUID `json:"_id"`
	Useranme       string    `json:"username"`
	Email          string    `json:"email"`
	Avatar         string    `json:"avatar"`
	AvatarPublicID string    `json:"avatar_public_id"`
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

	var existingUser models.User

	result := u.DB.Where("email=?", email).First(&existingUser)

	if err := result.Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "User with the given email already exists",
			"status":  "error",
		})
		return
	}

	localFilePath, exists := ctx.Get("localFilePath")

	if !exists {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":  "avatar is required!",
			"status": "error",
		})
		return
	}

	localFilePathString, ok := localFilePath.(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":  "invalid type for localFilePath!",
			"status": "error",
		})
		return
	}

	uploadedAssetCredentails, err := services.UploadImage(localFilePathString)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while uploading image",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	newUser := models.User{
		Username:       username,
		Email:          strings.TrimSpace(strings.ToLower(email)),
		Password:       password,
		AvatarPublicID: uploadedAssetCredentails[1],
	}

	if len(uploadedAssetCredentails) > 0 {
		newUser.Avatar = uploadedAssetCredentails[0]
	}

	result = u.DB.Create(&newUser)

	if err := result.Error; err != nil {
		log.Printf("[Error] while creating user" + err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  "error",
		})
		return
	}

	userResponse := UserApiResponse{
		ID:       newUser.ID,
		Useranme: newUser.Username,
		Email:    newUser.Email,
		Avatar:   newUser.Avatar,
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "Account created successfully!",
		"status":       "success",
		"created_user": userResponse,
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
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal server error!",
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

	accessToken, err := utils.GenerateToken(user.ID, user.Email)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while generating accessToken",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	refreshToken, err := utils.GenerateToken(user.ID, user.Email)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while generating refreshToken",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.SetCookie("refresh_token", refreshToken, 3600*24*30, "/", "", false, true)
	ctx.SetCookie("access_token", accessToken, 3600, "/", "localhost", false, true)

	userResponse := UserApiResponse{
		ID:       user.ID,
		Useranme: user.Username,
		Email:    user.Email,
		Avatar:   user.Avatar,
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successful!",
		"status":  "success",
		"account": userResponse,
	})
}

func (u *UserController) Logout(ctx *gin.Context) {

	ctx.SetCookie("refresh_token", "", -1, "/", "", false, true)
	ctx.SetCookie("access_token", "", -1, "/", "", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Logout successful!",
		"status":  "success",
	})
}

func (u *UserController) GetUserByID(userID uuid.UUID) *UserApiResponse {

	var user models.User

	result := u.DB.Where("id= ?", userID).First(&user)

	if error := result.Error; error != nil {
		if error == gorm.ErrRecordNotFound {
			log.Print("Record not found!")
		}
		return nil
	}

	userResponse := UserApiResponse{
		ID:             user.ID,
		Useranme:       user.Username,
		Email:          user.Email,
		Avatar:         user.Avatar,
		AvatarPublicID: user.AvatarPublicID,
	}

	return &userResponse

}

func (u *UserController) GetCurrentUser(ctx *gin.Context) {
	user, ok := ctx.Get("user")
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized request ! user not found in the current context",
			"status":  "error",
		})
	}

	userConv, ok := user.(*UserApiResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized request ! user not found in the current context",
			"status":  "error",
		})
	}

	var ExistingUserInDB models.User

	result := u.DB.Where("id=?", userConv.ID).First(&ExistingUserInDB)

	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "User not found!",
				"status":  "error",
			})
		}
		return
	}

	apiReponse := UserApiResponse{
		ID:       ExistingUserInDB.ID,
		Useranme: ExistingUserInDB.Username,
		Email:    ExistingUserInDB.Email,
		Avatar:   ExistingUserInDB.Avatar,
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "Unauthorized request ! user not found in the current context",
		"status":       "error",
		"current_user": apiReponse,
	})

}

func (u *UserController) UpdateUserAvatar(ctx *gin.Context) {
	localFilePath, exists := ctx.Get("localFilePath")

	if !exists {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error":  "avatar not found!",
			"status": "error",
		})
		return
	}

	localFilePathString, ok := localFilePath.(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":  "invalid type for localFilePath!",
			"status": "error",
		})
		return
	}

	user, ok := ctx.Get("user")

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized request ! user not found in the current context",
			"status":  "error",
		})
	}

	userConv, ok := user.(*UserApiResponse)

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error parsing user",
			"status":  "error",
		})
		return
	}

	uploadImageParams, err := services.UploadImage(localFilePathString)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while uploading image",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	_, err = services.DeleteImage(userConv.AvatarPublicID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while deleting image",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}
	updates := models.User{
		Avatar:         uploadImageParams[0],
		AvatarPublicID: uploadImageParams[1],
	}

	if err := u.DB.Model(&models.User{}).Where("id = ?", userConv.ID).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update user avatar!",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Avatar updated successfully!",
		"status":  "success",
	})
}

func (u *UserController) UpdateUserDetails(ctx *gin.Context) {
	newUsername, newEmail := ctx.PostForm("newUsername"), ctx.PostForm("newEmail")

	if strings.Trim(newUsername, "") == "" && strings.Trim(newEmail, "") == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "No details provided , invalid operation!",
			"status":  "error",
		})
		return
	}

	var updatedUser models.User

	if strings.Trim(newUsername, "") != "" {
		updatedUser.Username = newUsername
	}

	if strings.Trim(newEmail, "") != "" {
		updatedUser.Email = newEmail
	}

	user, ok := ctx.Get("user")
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized request , user not found!",
			"status":  "error",
		})
		return
	}

	userConv, ok := user.(*UserApiResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error parsing user",
			"status":  "error",
		})
		return
	}

	updateQueryResult := u.DB.Where("id=?", userConv.ID).Updates(&updatedUser)

	if err := updateQueryResult.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update user details!",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "details updated successfully",
		"status":  "success",
	})

}

func (u *UserController) ResetPassword(ctx *gin.Context) {
	newPassword, confirmPassword := ctx.PostForm("newPassword"), ctx.PostForm("confirmPassword")

	if strings.Trim(newPassword, "") == "" || strings.Trim(confirmPassword, "") == "" {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "both new password and confirmation are required!",
			"status":  "error",
		})
		return
	}

	if newPassword != confirmPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "passwords don't match!",
			"status":  "error",
		})
		return
	}

	user, ok := ctx.Get("user")
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized request , user not found!",
			"status":  "error",
		})
		return
	}

	userConv, ok := user.(*UserApiResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error parsing user",
			"status":  "error",
		})
		return
	}

	updates := models.User{
		Password: newPassword,
	}

	updateQuery := u.DB.Where("id=?", userConv.ID).Updates(&updates)

	if err := updateQuery.Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update user details!",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "password updated successfully",
		"status":  "success",
	})

}

func (u *UserController) RenewAccessToken(ctx *gin.Context) {

	refreshToken, err := ctx.Cookie("refresh_token")

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "refresh token not found!",
			"error":   err.Error(),
			"status":  "error",
		})
		return
	}

	tokens, err := utils.RefreshAccessToken(refreshToken)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while refreshing the access token",
			"error":   err.Error(),
			"status":  "error",
		})
		return

	}

	ctx.SetCookie("refresh_token", tokens[1], 3600*24*30, "/", "localhost", false, true)
	ctx.SetCookie("access_token", tokens[0], 3600, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "AcessToken refresh successfull!",
		"status":  "success",
	})

}
