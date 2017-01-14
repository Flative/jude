package main

import (
	"strings"

	"github.com/satori/go.uuid"
)

type Manager struct {
	Clients []*Client
}

func newManager() *Manager {
	return &Manager{
		Clients: make([]*Client, 0),
	}
}

func (m *Manager) register(c *Client) {
	m.Clients = append(m.Clients, c)
}

func (m *Manager) broadcast(data []byte) error {
	var disconnectedIDs []uuid.UUID

	for _, client := range m.Clients {
		if err := client.send(data); err != nil {
			disconnectedIDs = append(disconnectedIDs, client.ID)
			client.Conn.Close()
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
