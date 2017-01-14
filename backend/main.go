package main

import (
	"encoding/json"
	"flag"
	"html/template"
	"log"
	"net/http"

	"fmt"

	"strings"

	"github.com/gorilla/mux"
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

		client := newClient(manager, conn)
		manager.register(client)
		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				client.Conn.Close()
				log.Println(err)
				return
			}

			event := new(Event)
			if err = json.Unmarshal(data, &event); err != nil {
				log.Println(err)
				continue
			}

			switch event.Action {
			case "init":
				typeInit := EventTypeInit{}
				if err = json.Unmarshal(event.Body, &typeInit); err != nil {
					log.Println(err)
					continue
				}

				if strings.Compare(typeInit.Name, "speaker") == 0 {
					isFirstSpeaker := true
					for _, client := range manager.Clients {
						if client.isAuthenticated && client.isSpeaker {
							isFirstSpeaker = false
						}
					}

					if !isFirstSpeaker {
						conn.Close()
						return
					}

					client.isSpeaker = true
				}

				client.isAuthenticated = true
				if err := client.send(storedData); err != nil {
					log.Println(err)
					return
				}
			case "update":
				storedData = event.Body
				if err := manager.broadcast(storedData); err != nil {
					log.Println(err)
					return
				}
			}
		}
	})
	port := flag.Int("port", 8000, "This is port")
	homeTemplate := template.Must(template.ParseFiles("../frontend/index.html"))
	flag.Parse()
	log.Printf("\n\n* Running on\n* ws://0.0.0.0:%d/ws\n* http://0.0.0.0:%d/\n\n(Press CTRL+C to quit)\n", *port, *port)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("../frontend/static"))))
	rtr := mux.NewRouter()

	indexHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		homeTemplate.Execute(w, r.Host)
	}

	rtr.HandleFunc("/{*}", indexHandler)
	rtr.HandleFunc("/", indexHandler)
	http.Handle("/", rtr)
	log.Fatalln(http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", *port), nil))
}
