package services

import (
	"cfg/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

var projectNumber = 1

func AnalyzeHeadless(scriptPath string, binaryPath string, hashString string) {
	defer os.Remove(binaryPath)
	cmd := exec.Command("../ghidra_10.2.3_PUBLIC/support/analyzeHeadless", "/home/gradle/", "project"+strconv.Itoa(projectNumber), "-scriptPath", "./ghidra_scripts/", "-postscript", scriptPath, "-import", binaryPath, "-deleteProject")
	projectNumber++
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	analysisFolder := "/home/gradle/tmp/"
	dir, _ := os.ReadDir(analysisFolder + hashString)
	defer os.RemoveAll(analysisFolder + hashString)
	for _, file := range dir {
		content, _ := os.ReadFile(analysisFolder + hashString + "/" + file.Name())
		binary := models.Binary{Id: primitive.NewObjectID(), Hash: hashString, FuncName: strings.Split(file.Name(), ".")[0], Dot: string(content)}
		mongoClient.insertBinary("cfg", "binary", binary)
	}
	log.Println("Analyze Done")
}
