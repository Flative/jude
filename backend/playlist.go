package main

type Playlist struct {
	SongList      []*Song `json:"items"`
	ActiveSong    *Song   `json:"activeItem"`
	IsPaused      bool    `json:"isPaused"`
	CurrentTime   int     `json:"currentTime"`
	Duration      int     `json:"duration"`
	RepeatingMode string  `json:"repeatingMode"` // ENUM("all", "one", "none")
	IsShuffleOn   bool    `json:"isShuffleOn"`
}

func newPlaylist() *Playlist {
	return &Playlist{
		SongList:      make([]*Song, 0),
		ActiveSong:    nil,
		IsPaused:      false,
		CurrentTime:   0,
		Duration:      0,
		RepeatingMode: "none",
		IsShuffleOn:   false,
	}
}
