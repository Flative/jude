package main

type Manager struct {
	Clients  []*Client
	Playlist *Playlist
}

func newManager() *Manager {
	return &Manager{
		Clients: make([]*Client, 0),
	}
}

func (m *Manager) register(c *Client) {
	m.Clients = append(m.Clients, c)
}

func (m *Manager) broadcast(messageType int, data []byte) error {
	for _, client := range m.Clients {
		err := client.conn.WriteMessage(messageType, data)
		if err != nil {
			return err
		}
	}

	return nil
}
