package utils

import "github.com/google/uuid"

func StringtoUuid(textUuid string) (uuid.UUID, error) {
	uuid, err := uuid.Parse(textUuid)
	if err != nil {
		return uuid, err
	}
	return uuid, nil
}
