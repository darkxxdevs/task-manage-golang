package services

import (
	"context"
	"fmt"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"os"
	"time"
)

func newCloud() (*cloudinary.Cloudinary, error) {
	return cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"))
}

func UploadImage(localpath string) ([]string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	defer cancel()

	cld, err := newCloud()
	if err != nil {
		return nil, fmt.Errorf("[Error] creating cloudinary client: %w", err)
	}

	response, err := cld.Upload.Upload(ctx, localpath, uploader.UploadParams{
		Folder: "go-cloudinary",
	})

	if err != nil {
		return nil, fmt.Errorf("[Error] while uploading image: %w", err)
	}

	return []string{response.URL, response.PublicID}, nil
}

func DeleteImage(publicID string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	defer cancel()

	cld, err := newCloud()

	if err != nil {
		return false, fmt.Errorf("[Error] creating cloudinary client: %w", err)
	}

	response, _ := cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID:     publicID,
		ResourceType: "image",
	})

	if len(response.Error.Message) > 0 {
		return false, fmt.Errorf("%s", response.Error.Message)
	}

	return true, nil
}
