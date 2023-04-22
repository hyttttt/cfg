package controller

import (
	"cfg/services"
	"crypto/sha256"
	"encoding/hex"
	"github.com/Jeffail/tunny"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
	"runtime"
)

var pool *tunny.Pool

type AnalyzeTask struct {
	file           string
	uploadFilePath string
	hashString     string
}

func init() {
	numCPUs := runtime.NumCPU()
	pool = tunny.NewFunc(numCPUs, func(task interface{}) interface{} {
		analyzeTask := task.(AnalyzeTask)
		services.AnalyzeHeadless(analyzeTask.file, analyzeTask.uploadFilePath, analyzeTask.hashString)
		return true
	})
	pool.SetSize(1)
}

func HomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func CFGPage(c *gin.Context) {
	c.HTML(http.StatusOK, "cfg.html", gin.H{})
}

func HashList(c *gin.Context) {
	services.GetHashList(c)
}

func Binary(c *gin.Context) {
	target := c.Param("hash")
	services.GetFunction(c, target)
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
	analyzeTask := AnalyzeTask{"cfg.py", uploadFilePath, hashString}
	go pool.Process(analyzeTask)
	c.JSON(http.StatusOK, gin.H{"hash": hashString})
}
