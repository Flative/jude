package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"

	"fmt"

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
