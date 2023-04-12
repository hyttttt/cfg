package main

import (
	routes "cfg/router"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	router := routes.NewRouter()
	router.Run(":8000")
}
