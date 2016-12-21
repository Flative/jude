package main

import (
	"testing"
)

func TestSongValidate(t *testing.T) {
	song := newSong()
	var validationResult bool

	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	song.ID = "ecFZkVn4iW4"
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	song.Title = "This is title of song"
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	song.UUID = "705999e4-4c5c-4258-bee0-501eb0a27b3a"
	validationResult = song.validate()
	if validationResult {
		t.Errorf("%t should be false", validationResult)
	}

	song.Index = 1
	validationResult = song.validate()
	if !validationResult {
		t.Errorf("%t should be true", validationResult)
	}

}
