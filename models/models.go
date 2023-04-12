package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Binary struct {
	Id       primitive.ObjectID `json:"cfg_id" bson:"_id"`
	Hash     string             `json:"hash" bson:"hash"`
	FuncName string             `json:"function" bson:"function"`
	Dot      string             `json:"dot" bson:"dot"`
}
