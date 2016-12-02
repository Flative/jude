package main

import (
	"flag"
	"net/http"

	"log"
)

var (
	addr = flag.String("addr", "127.0.0.1:5050", "http service address")
)

func main() {
	manager := newManager()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(manager, w, r)
	})
	log.Fatal(http.ListenAndServe(*addr, nil))
}
