package main

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
