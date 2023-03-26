package controller

import (
	"cfg/services"
	"log"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
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
		services.ReturnHashList(c)
	} else {
		services.ReturnFunction(c, target)
	}

}

func AnalyzeBinary(c *gin.Context) {
	cmd := exec.Command("./ghidra_10.2.3_PUBLIC/support/analyzeHeadless", "/home/gradle", "t", "-preScript", "test.py")
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	c.JSON(http.StatusOK, gin.H{})
}
