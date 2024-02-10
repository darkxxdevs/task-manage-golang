package services

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func newCloud() (*cloudinary.Cloudinary, error) {
	return cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"))
}

func UploadImage(localpath string) (string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	defer cancel()

	cld, err := newCloud()
	if err != nil {
		log.Fatal("[Error] creating cloudinary client:", err)
	}

	response, err := cld.Upload.Upload(ctx, localpath, uploader.UploadParams{
		Folder: "go-cloudinary",
	})

	if err != nil {
		log.Fatal("[Error] while uploading assets..", err)
	}

	fmt.Println("[Successful] cloudinary image upload!")

	return response.URL, nil
}
