window.onload = () => {
    const conn = new WebSocket('ws://' + host + '/ws')
    conn.onmessage = (res) => {
        const div = document.createElement('div')
        const br = document.createElement('br')
        div.textContent = `Response : ${res.data}`
        document.getElementById('right').append(div)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
    }

    document.getElementById('add').addEventListener("click", () => {
        const data = {
            "action": "add",
            "body": {
                "id": "xnPQhqEgkkQ",
                "title": "This is title of song",
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
                "index": 1
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('remove').addEventListener("click", () => {
        const data = {
            "action": "delete",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('play').addEventListener("click", () => {
        const data = {
            "action": "play",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('pause').addEventListener("click", () => {
        const data = {
            "action": "pause",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
                "currentTime": 12
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('update').addEventListener("click", () => {
        const data = {
            "action": "update",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
                "currentTime": 12
            }
        }
        conn.send(JSON.stringify(data))
    })
}