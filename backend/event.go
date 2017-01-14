package main

import "encoding/json"

type Event struct {
	Action string          `json:"action"`
	Body   json.RawMessage `json:"body"`
}

type EventTypeInit struct {
	Name string `json:"type"`
}
