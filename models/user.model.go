package models

import (
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null"`
	Password string `gorm:"not null"`
	Email    string `gorm:"unique;not null"`
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
