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
	target := c.Param("cfg_id")
	services.GetDot(c, target)
}

func AnalyzeBinary(c *gin.Context) {
	uploadFile, _ := c.FormFile("file")
	log.Println(uploadFile.Filename)
	uploadFolder := "/home/gradle/upload/"
	uploadFilePath := uploadFolder + uploadFile.Filename
	c.SaveUploadedFile(uploadFile, uploadFilePath)
	file, _ := os.Open(uploadFilePath)
	hash := sha256.New()
	_, err := io.Copy(hash, file)
	if err != nil {
		log.Fatalf("%s\n", err)
	}
	file.Close()
	hashString := hex.EncodeToString(hash.Sum(nil))
	os.Rename(uploadFilePath, uploadFolder+hashString)
	uploadFilePath = uploadFolder + hashString
	go services.AnalyzeHeadless("cfg.py", uploadFilePath, hashString)
	c.JSON(http.StatusOK, gin.H{"hash": hashString})
}
