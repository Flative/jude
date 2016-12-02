package main

import (
	"log"
	"net/http"

	"encoding/json"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func serveWs(manager *Manager, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{manager: manager, conn: conn}
	manager.register(client)

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			return
		}

		event := new(Event)
		json.Unmarshal(p, &event)
		err = conn.WriteMessage(messageType, p)
		if err != nil {
			log.Println(err)
			return
		}
	}
}
