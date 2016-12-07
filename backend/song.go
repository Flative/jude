package main

type Song struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	UUID  string `json:"uuid"`
	Index int    `json:"index"`
}

func newSong() *Song {
	return &Song{
		ID:    "",
		Title: "",
		UUID:  "",
		Index: -1,
	}
}

func (s *Song) validate() bool {
	return s.ID != "" && s.Title != "" && s.UUID != "" && s.Index != -1
}
