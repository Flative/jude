package main

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestEvent(t *testing.T) {
	var event *Event
	var rawData []byte

	rawData = []byte(`{
        "action": "add",
        "body": {
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 1
        }
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "add") != 0 {
		t.Errorf("'%s' should be 'add'", event.Action)
	}

	rawData = []byte(`{
        "action": "delete",
        "body": {
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
        }
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "delete") != 0 {
		t.Errorf("'%s' should be 'delete'", event.Action)
	}

	rawData = []byte(`{
        "action": "activate",
        "body": {
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
        }
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "activate") != 0 {
		t.Errorf("'%s' should be 'activate'", event.Action)
	}

	rawData = []byte(`{
        "action": "play",
        "body": null
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "play") != 0 {
		t.Errorf("'%s' should be 'play'", event.Action)
	}

	rawData = []byte(`{
        "action": "pause",
        "body": null
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "pause") != 0 {
		t.Errorf("'%s' should be 'pause'", event.Action)
	}

	rawData = []byte(`{
        "action": "update",
        "body": {
            "currentTime": 12,
            "duration": 212,
            "repeatingMode": "all",
            "isShuffleOn": true
        }
    }`)
	event = &Event{}
	if err := json.Unmarshal(rawData, &event); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	if strings.Compare(event.Action, "update") != 0 {
		t.Errorf("'%s' should be 'update'", event.Action)
	}
}
