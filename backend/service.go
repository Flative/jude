package main

import (
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
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(s.manager, w, r)
	})
	log.Printf("\n\n* Running on\n* ws://%s/ws\n* http://%s/\n\n(Press CTRL+C to quit)\n", s.addr, s.addr)
	log.Fatal(http.ListenAndServe(s.addr, nil))
}
