# API Spec

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

#### Delete song from playlist

request :

```json
{
    "action": "delete",
    "body": {
        "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
    }
}
```

#### Activate song

request :

```json
{
    "action": "activate",
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
    "body": null
}
```

#### Pause current playing song

request :

```json
{
    "action": "pause",
    "body": null
}
```

#### Update current playing song's currentTime

Host client send `update packet` using own youtube player callback.

Then server will send state data to each client

request :

```json
{
    "action": "update",
    "body": {
        "currentTime": 12,
        "duration": 212,
        "repeatingMode": ENUM("all", "one", "none"),
        "isShuffleOn": true
    }
}
```