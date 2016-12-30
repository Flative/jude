package main

import (
	"encoding/json"
	"testing"
)

func TestSongValidate(t *testing.T) {
	var song *Song
	var validationResult bool
	var rawData []byte

	rawData = []byte(`{
		"id": "2qVUvnnbsJk",
		"title": "This is title of song",
		"uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
		"index": 3
	}`)
	song = newSong()
	if err := json.Unmarshal(rawData, &song); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	validationResult = song.validate()
	if !validationResult {
		t.Errorf("%t should be true", validationResult)
	}

	rawData = []byte(`{
		"id": "",
		"title": "This is title of song",
		"uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
		"index": 3
	}`)
	song = newSong()
	if err := json.Unmarshal(rawData, &song); err != nil {
		t.Error("Invalid JSON")
	}
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	rawData = []byte(`{
		"id": "2qVUvnnbsJk",
		"title": "",
		"uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
		"index": 3
	}`)
	song = newSong()
	if err := json.Unmarshal(rawData, &song); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	rawData = []byte(`{
		"id": "2qVUvnnbsJk",
		"title": "This is title of song",
		"uuid": "",
		"index": 3
	}`)
	song = newSong()
	if err := json.Unmarshal(rawData, &song); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	rawData = []byte(`{
		"id": "2qVUvnnbsJk",
		"title": "This is title of song",
		"uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
		"index": -1
	}`)
	song = newSong()
	if err := json.Unmarshal(rawData, &song); err != nil {
		t.Errorf("Every raw data should be parsed")
	}
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}
}
