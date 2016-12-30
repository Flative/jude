package main

import "testing"

func TestServiceWithoutOption(t *testing.T) {
	NewService(nil)
}

func TestServiceWithHostOption(t *testing.T) {
	options := map[string]interface{}{"host": "127.0.0.1"}
	NewService(options)
}

func TestServiceWithPortOption(t *testing.T) {
	options := map[string]interface{}{"port": 5000}
	NewService(options)
}

func TestServiceWithHostAndPortOption(t *testing.T) {
	options := map[string]interface{}{"host": "127.0.0.1", "port": 5000}
	NewService(options)
}

func TestServiceWithNotPermittedOption(t *testing.T) {
	options := map[string]interface{}{"host": 950417, "port": "Hello"}
	NewService(options)
}
