package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

type Service struct {
	host    string
	port    int
	addr    string
	manager *Manager
}

func NewService(options map[string]interface{}) Service {
	service := Service{}

	if host, ok := options["host"].(string); ok {
		service.host = host
	} else {
		service.host = "127.0.0.1"
	}

	if port, ok := options["port"].(float64); ok {
		service.port = int(port)
	} else {
		service.port = 5050
	}

	service.addr = service.host + ":" + strconv.Itoa(service.port)
	service.manager = newManager()
	return service
}

func (s *Service) Run() {
	var (
		addr         = flag.String("addr", s.addr, "http service address")
		homeTemplate = template.Must(template.ParseFiles("static/index.html"))
	)

	log.Printf("\n\n* Running on\n* ws://%s/ws\n* http://%s/\n\n(Press CTRL+C to quit)\n", *addr, *addr)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		homeTemplate.Execute(w, r.Host)
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(s.manager, w, r)
	})
	log.Fatal(http.ListenAndServe(*addr, nil))
}
