package router

import (
	"cfg/controller"

	"github.com/gin-gonic/gin"
)

type Route struct {
	Method  func(engine *gin.Engine, path string, handler func(c *gin.Context))
	Path    string
	Handler func(c *gin.Context)
}

var routes []Route

func GET(engine *gin.Engine, path string, handler func(c *gin.Context)) {
	engine.GET(path, handler)
}

func POST(engine *gin.Engine, path string, handler func(c *gin.Context)) {
	engine.POST(path, handler)
}
func register(method func(engine *gin.Engine, path string, handler func(c *gin.Context)), path string, handler func(c *gin.Context)) {
	routes = append(routes, Route{method, path, handler})
}

func init() {
	register(GET, "/", controller.HomePage)
	register(GET, "/", controller.ReturnFunction)
}

func NewRouter() *gin.Engine {
	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "./static")
	for _, route := range routes {
		route.Method(router, route.Path, route.Handler)
	}
	return router
}
