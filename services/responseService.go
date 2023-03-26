package services

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type Binary struct {
	Id       primitive.ObjectID
	Hash     string
	FuncName string
	Dot      string
}

func ReturnFunction(c *gin.Context, target string) {
	client, ctx, cancel, err := ConnectMongo("")
	if err != nil {
		panic(err)
	}
	defer CloseMongo(client, ctx, cancel) //release resources
	PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("")

	result := Binary{}
	filter := bson.D{{"hash", target}}
	err = collection.FindOne(ctx, filter).Decode(&result)

	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "cfg_id:": &result.Id, "function name": &result.FuncName})
}

func ReturnHashList(c *gin.Context) {
	client, ctx, cancel, err := ConnectMongo("")
	if err != nil {
		panic(err)
	}
	defer CloseMongo(client, ctx, cancel) //release resources
	PingMongo(client, ctx)

	collection := client.Database("cfg").Collection("")

	filter := bson.D{}
	opts := options.Find().SetProjection(bson.D{{"hash", 1}})
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		panic(err)
	}
	var result []Binary
	if err = cursor.All(ctx, &result); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "list:": &result})
}

func ResponseInJson(c *gin.Context) {

}
