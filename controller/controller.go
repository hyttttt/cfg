package controller

import (
	"cfg/services"
	"crypto/sha256"
	"encoding/hex"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
)

func HomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func CFGPage(c *gin.Context) {
	c.HTML(http.StatusOK, "cfg.html", gin.H{})
}

func Hash(c *gin.Context) {
	target := c.Query("hash")
	if target == "" {
		services.GetHashList(c)
	} else {
		services.GetFunction(c, target)
	}

}

func Dot(c *gin.Context) {
	target := c.Query("cfg_id")
	services.GetDot(c, target)
}

func AnalyzeBinary(c *gin.Context) {
	uploadFile, _ := c.FormFile("file")
	log.Println(uploadFile.Filename)
	uploadFilePath := "/home/gradle/upload/" + uploadFile.Filename
	c.SaveUploadedFile(uploadFile, uploadFilePath)
	file, _ := os.Open(uploadFilePath)
	hash := sha256.New()
	_, err := io.Copy(hash, file)
	if err != nil {
		log.Fatalf("%s\n", err)
	}
	file.Close()
	hashString := hex.EncodeToString(hash.Sum(nil))
	os.Rename(uploadFilePath, "/home/gradle/upload/"+hashString)
	uploadFilePath = "/home/gradle/upload/" + hashString
	defer os.Remove(uploadFilePath)
	services.AnalyzeHeadless("cfg.py", uploadFilePath)
	dir, _ := os.ReadDir("/home/gradle/tmp/" + hashString)
	defer os.RemoveAll("/home/gradle/tmp/" + hashString)
	for _, file := range dir {
		// defer os.Remove("/home/gradle/tmp/" + string(hash.Sum(nil)) + file.Name())
		content, _ := os.ReadFile("/home/gradle/tmp/" + hashString + "/" + file.Name())
		log.Println(file.Name())
		log.Println(string(content))
	}
	c.JSON(http.StatusOK, gin.H{"hash": hashString})
}
