package main

import (
	"flag"
	"html/template"
	"net/http"

	"log"
)

var (
	addr      = flag.String("addr", "127.0.0.1:7070", "http service address")
	homeTempl = template.Must(template.ParseFiles("home.html"))
)

func main() {
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", serveWs)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
