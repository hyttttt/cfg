package services

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

func GetFunction(c *gin.Context, target string) {
	filter := bson.D{bson.E{Key: "hash", Value: target}}
	projection := bson.D{{"cfg_id", 1}, {"function", 1}}
	results := mongoClient.ListBinaries("cfg", "binary", filter, projection)
	var response []bson.M
	for _, res := range results {
		response = append(response, bson.M{"cfg_id": res.Id.Hex(), "function": res.FuncName})
	}
	c.JSON(http.StatusOK, response)
}

func GetHashList(c *gin.Context) {
	results := mongoClient.ListField("cfg", "binary", "hash")
	c.JSON(http.StatusOK, results)
}

func GetDot(c *gin.Context, target string) {
	id, _ := primitive.ObjectIDFromHex(target)
	filter := bson.D{bson.E{Key: "_id", Value: id}}
	result := mongoClient.FindBinary("cfg", "binary", filter)
	c.JSON(http.StatusOK, gin.H{"cfg_id": result.Id.Hex(), "dot": result.Dot})
}
