package main

import (
	"sync"

	"github.com/gorilla/websocket"
	"github.com/satori/go.uuid"
)

type Client struct {
	ID      uuid.UUID
	Manager *Manager
	Conn    *websocket.Conn
	mu      sync.Mutex
}

func newClient(manager *Manager, conn *websocket.Conn) *Client {
	return &Client{
		ID:      uuid.NewV4(),
		Manager: manager,
		Conn:    conn,
	}
}
