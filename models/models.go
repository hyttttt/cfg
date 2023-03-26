package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Binary struct {
	Id       primitive.ObjectID `json:"cfg_id"`
	Hash     string             `json:"hash"`
	FuncName string             `json:"function"`
	Dot      string             `json:"dot"`
}
