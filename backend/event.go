package main

import "encoding/json"

type Event struct {
	Action string          `json:"action"`
	Body   json.RawMessage `json:"body"`
}
