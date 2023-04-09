package services

import (
	"log"
	"os/exec"
	"strconv"
)

var project_number = 1

func AnalyzeHeadless(scriptPath string, binaryPath string) {
	cmd := exec.Command("../ghidra_10.2.3_PUBLIC/support/analyzeHeadless", "/home/gradle/", "project"+strconv.Itoa(project_number), "-scriptPath", "./ghidra_scripts/", "-postscript", scriptPath, "-import", binaryPath, "-deleteProject")
	project_number++
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
}
