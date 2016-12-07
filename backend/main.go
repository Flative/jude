package main

import (
	"flag"
	"html/template"
	"net/http"

	"log"
)

var (
	addr         = flag.String("addr", "127.0.0.1:5050", "http service address")
	homeTemplate = template.Must(template.ParseFiles("index.html"))
)

func main() {
	manager := newManager()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		homeTemplate.Execute(w, r.Host)
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(manager, w, r)
	})
	log.Fatal(http.ListenAndServe(*addr, nil))
}
