package main

import "encoding/json"

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
	for _, client := range m.Clients {
		body, err := json.Marshal(m.Playlist)
		if err != nil {
			return err
		}

		err = client.conn.WriteMessage(messageType, body)
		if err != nil {
			return err
		}
	}

	return nil
}
