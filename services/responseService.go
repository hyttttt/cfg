package services

import (
	"encoding/json"
	"net/http"
)

func ResponseWithJson(w http.ResponseWriter, res interface{}) {
	response, _ := json.Marshal(res)
	w.Write(response)
}
