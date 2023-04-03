package services

import (
	"log"
	"os/exec"
)

func AnalyzeHeadless(scriptPath string, binaryPath string) {
	cmd := exec.Command("../ghidra_10.2.3_PUBLIC/support/analyzeHeadless", "/home/gradle/", "project", "-scriptPath", "./ghidra_scripts/", "-postscript", scriptPath, "-import", binaryPath, "-deleteProject")
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
}
