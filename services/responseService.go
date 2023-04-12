package services

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

func GetFunction(c *gin.Context, target string) {
	filter := bson.D{bson.E{Key: "hash", Value: target}}
	result := mongoClient.FindOne("cfg", "binary", filter)
	c.JSON(http.StatusOK, gin.H{"status": "success", "cfg_id:": result.Id, "function name": result.FuncName})
}

func GetHashList(c *gin.Context) {
	results := mongoClient.List("cfg", "binary")
	c.JSON(http.StatusOK, gin.H{"list": results})
}

func GetDot(c *gin.Context, target string) {
	filter := bson.D{bson.E{Key: "cfg_id", Value: target}}
	result := mongoClient.FindOne("cfg", "binary", filter)
	c.JSON(http.StatusOK, gin.H{"cfg_id": target, "dot": result.Dot})
}
