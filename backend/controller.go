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
		if err = json.Unmarshal(p, &event); err != nil {
			log.Fatal(err)
		}

		switch event.Action {
		case "add":
			if err = manager.Playlist.add(event.Body); err != nil {
				log.Fatal(err)
			}
		case "delete":
			if err = manager.Playlist.delete(event.Body); err != nil {
				log.Fatal(err)
			}
		case "activate":
			if err = manager.Playlist.activate(event.Body); err != nil {
				log.Fatal(err)
			}
		case "play":
			if err = manager.Playlist.play(); err != nil {
				log.Fatal(err)
			}
		case "pause":
			if err = manager.Playlist.pause(); err != nil {
				log.Fatal(err)
			}
		case "update":
			if err = manager.Playlist.update(event.Body); err != nil {
				log.Fatal(err)
			}
		}

		if err := manager.broadcast(messageType); err != nil {
			log.Println(err)
		}
	}
}
