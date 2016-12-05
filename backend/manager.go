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
