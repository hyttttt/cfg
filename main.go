package main

import (
	routes "cfg/router"
)

func main() {
	router := routes.NewRouter()
	router.Run(":8000")
}
