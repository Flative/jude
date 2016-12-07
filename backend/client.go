package main

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	manager *Manager
	conn    *websocket.Conn
}
