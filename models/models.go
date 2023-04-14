package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Binary struct {
	Id       primitive.ObjectID `json:"cfg_id" bson:"_id,omitempty"`
	Hash     string             `json:"hash" bson:"hash,omitempty"`
	FuncName string             `json:"function" bson:"function,omitempty"`
	Dot      string             `json:"dot" bson:"dot,omitempty"`
}
