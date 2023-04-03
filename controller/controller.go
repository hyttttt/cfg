package controller

import (
	"cfg/services"
	"crypto/md5"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
)

func HomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "CFG Viewer",
	})
}

func CFGPage(c *gin.Context) {
	c.HTML(http.StatusOK, "cfg.html", gin.H{
		"title": c.Param("hash"),
	})
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
	hash := md5.New()
	_, err := io.Copy(hash, file)
	if err != nil {
		log.Fatalf("%s\n", err)
	}
	file.Close()
	services.AnalyzeHeadless("cfg_entry.py", uploadFilePath)
	os.Remove(uploadFilePath)
	content, _ := os.ReadFile("/home/gradle/tmp/entry.dot")
	os.Remove("/home/gradle/tmp/entry.dot")
	c.JSON(http.StatusOK, gin.H{"hash": hash.Sum(nil), "dot": string(content)})
}
