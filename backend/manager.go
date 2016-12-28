package main

import (
	"encoding/json"
	"log"

	"strings"

	"github.com/satori/go.uuid"
)

type Manager struct {
	Clients  []*Client
	Playlist *Playlist
}

func newManager() *Manager {
	return &Manager{
		Clients:  make([]*Client, 0),
		Playlist: newPlaylist(),
	}
}

func (m *Manager) register(c *Client) {
	m.Clients = append(m.Clients, c)
}

func (m *Manager) broadcast(messageType int) error {
	var disconnectedIDs []uuid.UUID

	for _, client := range m.Clients {
		body, err := json.Marshal(m.Playlist)
		if err != nil {
			log.Println(err)
			continue
		}

		err = client.Conn.WriteMessage(messageType, body)
		if err != nil {
			disconnectedIDs = append(disconnectedIDs, client.ID)
			client.Conn.Close()
			continue
		}
	}
	for _, ID := range disconnectedIDs {
		for i, client := range m.Clients {
			if strings.Compare(client.ID.String(), ID.String()) == 0 {
				m.Clients = append(m.Clients[:i], m.Clients[i+1:]...)
			}
		}
	}

	return nil
}
