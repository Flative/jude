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
	log.Print("Manager : ", manager)
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			return
		}

		event := new(Event)
		json.Unmarshal(p, &event)
		switch event.Action {
		case "add":
			log.Print("Add Event : ", event)
		case "remove":
			log.Print("Remove Event : ", event)
		case "play":
			log.Print("Play Event : ", event)
		case "pause":
			log.Print("Pause Event : ", event)
		case "update":
			log.Print("Update Event : ", event)
		}

		res, err := json.Marshal(event)
		if err != nil {
			log.Println(err)
		}

		err = conn.WriteMessage(messageType, res)
		if err != nil {
			log.Println(err)
			return
		}
	}
}
