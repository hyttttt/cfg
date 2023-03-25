package controller

import (
	"cfg/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type binary struct {
	Id       primitive.ObjectID
	Hash     string
	FuncName string
	Dot      string
}

func HomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "CFG Viewer",
	})
}

func ReturnFunction(c *gin.Context) {
	client, ctx, cancel, err := services.ConnectMongo("")
	if err != nil {
		panic(err)
	}
	defer services.CloseMongo(client, ctx, cancel) //release resources
	services.PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("")

	target := c.Param("hash")
	result := binary{}
	filter := bson.D{{"hash", target}}
	err = collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "cfg_id:": &result.Id, "function name": &result.FuncName})
}
