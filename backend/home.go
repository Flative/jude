package main

import (
	"net/http"
)

func serveHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	homeTempl.Execute(w, r.Host)
}

func serveWs(w http.ResponseWriter, r *http.Request) {

}
