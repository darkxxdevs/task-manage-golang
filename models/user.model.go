package models

import (
	"errors"
	"log"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID uuid.UUID `gorm:"primary_key;type:uuid"`
	gorm.Model
	Username string `json:"username"   gorm:"uniqueIndex;not null"`
	Password string `json:"password"   gorm:"not null"`
	Email    string `json:"email"      gorm:"unique;not null"`
	Tasks    []Task `json:"tasks"       gorm:"foreignKey:UserID"`
	Avatar   string `json:"avatar,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.ID = uuid.New()

	return nil
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("[Error] occured while hashing the password!", err)
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) ComparePassword(plainpassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainpassword))
}

func (u *User) Validate() error {

	if u.Username == "" {
		return errors.New("username is required")
	}

	if u.Password == "" {
		return errors.New("password is required")
	}

	if u.Email == "" {
		return errors.New("email is required")
	}

	return nil

}
