package main

type Event struct {
	Action string `json:"action"`
	Body   map[string]interface{}
}
