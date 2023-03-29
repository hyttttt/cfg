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
	c.SaveUploadedFile(uploadFile, "/home/gradle/upload/"+uploadFile.Filename)
	file, _ := os.Open("/home/gradle/upload/" + uploadFile.Filename)
	hash := md5.New()
	_, err := io.Copy(hash, file)
	if err != nil {
		log.Fatalf("%s\n", err)
	}
	file.Close()
	os.Remove("/home/gradle/upload/" + uploadFile.Filename)
	/*cmd := exec.Command("../ghidra_10.2.3_PUBLIC/support/analyzeHeadless", "/home/gradle/", "tmp", "-preScript", "test.py")
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}*/
	c.JSON(http.StatusOK, gin.H{"hash": hash.Sum(nil)})
}
