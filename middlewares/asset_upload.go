package middlewares

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func HandleAssetUpload() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		file, err := ctx.FormFile("avatar")

		if err != nil {
			fmt.Printf("[Error] %v", err.Error())
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error":   err.Error(),
				"message": "Avatar is missing!",
			})
			ctx.Abort()
			return
		}

		localFilePath, err := saveFile(ctx, file)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			ctx.Abort()
			return
		}

		ctx.Set("localFilePath", localFilePath)

		ctx.Next()
	}

}

func saveFile(ctx *gin.Context, file *multipart.FileHeader) (string, error) {

	dstPath := "../public/temp/" + file.Filename

	err := ctx.SaveUploadedFile(file, dstPath)

	if err != nil {
		log.Fatal("[Error] while taking file input ", err.Error())
		return "", err
	}

	absPath, err := filepath.Abs(dstPath)

	if err != nil {
		return "", err
	}

	return absPath, nil
}
