# API Specs

## Server -> Client

#### Fetching playlist

Sorted by index

response :
```json
{
    "items": [
        {
            "id": "ecFZkVn4iW4",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 1
        }, {
            "id": "xnPQhqEgkkQ",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 2
        }, {
            "id": "2qVUvnnbsJk",
            "title": "This is title of song",
            "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
            "index": 3
        }
    ],
    "activeItem": {
        "id": "xnPQhqEgkkQ",
        "title": "This is title of song",
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
        "index": 2
    },
    "isPaused": true,
    "currentTime": 12,
    "duration": 212,
    "repeatingMode": ENUM("all", "one", "none"),
    "isShuffleOn": true
}
```


## Client -> Server

#### Add song to playlist

request :
```json
{
    "action": "add",
    "body": {
        "id": "xnPQhqEgkkQ",
        "title": "This is title of song",
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
        "index": 1
    }
}
```

#### Remove song from playlist

request :
```json
{
    "action": "delete",
    "body": {
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
    }
}
```

#### Play current paused song

request :
```json
{
    "action": "play",
    "body": {
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
    }
}
```

#### Pause current playing song

request :
```json
{
    "action": "pause",
    "body": {
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
    }
}
```

#### Update current playing song's currentTime

request :
```json
{
    "action": "update",
    "body": {
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
        "currentTime": 12
    }
}
```