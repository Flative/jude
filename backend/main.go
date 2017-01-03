package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var storedData = []byte("")

func main() {
	manager := newManager()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		err = conn.WriteMessage(1, storedData)
		if err != nil {
			conn.Close()
			return
		}

		go func() {
			client := newClient(manager, conn)
			manager.register(client)

			for {
				_, data, err := conn.ReadMessage()
				if err != nil {
					client.Conn.Close()
					return
				}
				storedData = data
				if err := manager.broadcast(data); err != nil {
					log.Println(err)
					return
				}
			}
		}()

	})
	log.Printf("\n\n* Running on\n* ws://0.0.0.0:5050/ws\n\n(Press CTRL+C to quit)\n")
	log.Fatalln(http.ListenAndServe("0.0.0.0:5050", nil))
}
