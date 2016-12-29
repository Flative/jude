package main

var (
	options = map[string]interface{}{"host": "127.0.0.1", "port": 5050}
	service = NewService(options)
)

func main() {
	service.Run()
}
