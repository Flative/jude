package main

import (
	"sync"

	"github.com/gorilla/websocket"
	"github.com/satori/go.uuid"
)

type Client struct {
	ID              uuid.UUID
	Manager         *Manager
	Conn            *websocket.Conn
	mu              sync.Mutex
	isSpeaker       bool
	isAuthenticated bool
}

func newClient(manager *Manager, conn *websocket.Conn) *Client {
	return &Client{
		ID:      uuid.NewV4(),
		Manager: manager,
		Conn:    conn,
	}
}

func (c *Client) send(message []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if err := c.Conn.WriteMessage(1, message); err != nil {
		return err
	}

	return nil
}
