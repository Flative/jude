# API Spec

## Client -> Server

#### Init Jude

request :

```json
{
    "action": "init",
    "body": {
        "type": "SPEAKER"
    }
}
```

#### To sync global state

request :

```json
{
    "action": "update",
    "body": {
        "playlist": {
            "songs": [],
            "shuffle": false,
            "repeat": false,
            "activeSong": null,
            "nextItem": null,
            "hasPlaylistUpdated": false
        },
        "player": {
            "progressBarPercentage": 0,
            "updatePercentage": null,
            "youtubePlayerState": null,
            "isPaused": false,
            "isFinished": false
        },
        "app": {
            "mode": "STANDALONE",
            "isModeChanging": false,
            "wsConnection": null,
            "serverState": null
        }
    }
}
```