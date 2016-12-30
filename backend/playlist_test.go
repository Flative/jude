package main

import "testing"
import "strings"

func TestPlaylist(t *testing.T) {
	var event Event
	playlist := newPlaylist()

	event = Event{
		Action: "add",
		Body: []byte(`{
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song"
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            "index": 1
        }`),
	}
	if err := playlist.add(event.Body); err == nil {
		t.Error("JSON parsing should be failed")
	}

	event = Event{
		Action: "add",
		Body: []byte(`{
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": -1
        }`),
	}
	if err := playlist.add(event.Body); err == nil {
		t.Error("Data should be invalid")
	}

	event = Event{
		Action: "add",
		Body: []byte(`{
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 1
        }`),
	}
	if err := playlist.add(event.Body); err != nil {
		t.Error(err)
	}

	event = Event{
		Action: "delete",
		Body: []byte(`{
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",,
        }`),
	}
	if err := playlist.delete(event.Body); err == nil {
		t.Error("JSON parsing should be failed")
	}

	event = Event{
		Action: "delete",
		Body: []byte(`{
            "uuid": ""
        }`),
	}
	if err := playlist.delete(event.Body); err == nil {
		t.Error("Data should be invalid")
	}

	event = Event{
		Action: "delete",
		Body: []byte(`{
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
        }`),
	}

	if err := playlist.delete(event.Body); err != nil {
		t.Error(err)
	}

	if err := playlist.play(); err == nil {
		t.Error(err)
	}

	if err := playlist.pause(); err == nil {
		t.Error(err)
	}

	event = Event{
		Action: "add",
		Body: []byte(`{
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 1
        }`),
	}
	if err := playlist.add(event.Body); err != nil {
		t.Error(err)
	}

	event = Event{
		Action: "activate",
		Body: []byte(`{
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",,
        }`),
	}
	if err := playlist.activate(event.Body); err == nil {
		t.Error("JSON parsing should be failed")
	}

	event = Event{
		Action: "activate",
		Body: []byte(`{
            "uuid": ""
        }`),
	}
	if err := playlist.activate(event.Body); err == nil {
		t.Error("Data should be invalid")
	}

	event = Event{
		Action: "activate",
		Body: []byte(`{
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
        }`),
	}
	if err := playlist.activate(event.Body); err != nil {
		t.Error(err)
	}

	if playlist.ActiveSong == nil {
		t.Error("There should be no active song")
	}

	if err := playlist.play(); err != nil {
		t.Error("There should be active song")
	}

	if err := playlist.pause(); err != nil {
		t.Error("There should be active song")
	}

	event = Event{
		Action: "update",
		Body: []byte(`{
            "currentTime": 12,
            "duration": 212,,,,,,
            "repeatingMode": "hello",
            "isShuffleOn": true
        }`),
	}
	if err := playlist.update(event.Body); err == nil {
		t.Error("JSON parsing should be failed")
	}

	modes := []string{"all", "one", "none"}

	for _, mode := range modes {
		event = Event{
			Action: "update",
			Body: []byte(`{
                "currentTime": 12,
                "duration": 212,
                "repeatingMode": "` + mode + `",
                "isShuffleOn": true
            }`),
		}
		if err := playlist.update(event.Body); err != nil {
			t.Error(err)
		}

		if playlist.CurrentTime != 12 {
			t.Errorf("Playlist.CurrentTime is '%d' but should be '12'", playlist.CurrentTime)
		}

		if playlist.Duration != 212 {
			t.Errorf("Playlist.Duration is '%d' but should be '212'", playlist.Duration)
		}

		if strings.Compare(playlist.RepeatingMode, mode) != 0 {
			t.Errorf("Playlist.RepeatingMode is '%s' but should be '%s'", playlist.RepeatingMode, mode)
		}

		if playlist.IsShuffleOn != true {
			t.Errorf("Playlist.CurrentTime is '%f' but should be 'true'", playlist.IsShuffleOn)
		}
	}

	event = Event{
		Action: "update",
		Body: []byte(`{
            "currentTime": 12,
            "duration": 212,
            "repeatingMode": "none",
            "isShuffleOn": true
        }`),
	}
	if err := playlist.update(event.Body); err != nil {
		t.Error(err)
	}

	event = Event{
		Action: "update",
		Body: []byte(`{
            "currentTime": 12,
            "duration": 212,
            "repeatingMode": "hello",
            "isShuffleOn": true
        }`),
	}

	if strings.Compare(playlist.RepeatingMode, "none") != 0 {
		t.Errorf("Playlist.RepeatingMode is '%s' but should be 'none'", playlist.RepeatingMode)
	}

}
