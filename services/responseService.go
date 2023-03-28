package services

import (
	"cfg/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetFunction(c *gin.Context, target string) {
	uri := os.Getenv("MONGODB_URI")
	client, ctx, cancel, err := ConnectMongo(uri)
	if err != nil {
		panic(err)
	}
	defer CloseMongo(client, ctx, cancel) //release resources
	PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("binary")

	var result *models.Binary
	filter := bson.D{bson.E{Key: "hash", Value: target}}
	err = collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "cfg_id:": result.Id, "function name": result.FuncName})
}

func GetHashList(c *gin.Context) {
	uri := os.Getenv("MONGODB_URI")
	client, ctx, cancel, err := ConnectMongo(uri)
	if err != nil {
		panic(err)
	}
	defer CloseMongo(client, ctx, cancel) //release resources
	PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("binary")

	var result *models.Binary
	filter := bson.D{bson.E{Key: "hash", Value: true}}
	err = collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{"list": result})
}

func GetDot(c *gin.Context, target string) {
	uri := os.Getenv("MONGODB_URI")
	client, ctx, cancel, err := ConnectMongo(uri)
	if err != nil {
		panic(err)
	}
	defer CloseMongo(client, ctx, cancel) //release resources
	PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("binary")

	var result *models.Binary
	filter := bson.D{bson.E{Key: "cfg_id", Value: target}}
	err = collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{"cfg_id": target, "dot": result.Dot})
}
