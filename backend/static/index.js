window.onload = () => {
    const conn = new WebSocket('ws://' + host + '/ws')
    conn.onmessage = (res) => {
        const div = document.createElement('div')
        const br = document.createElement('br')
        div.textContent = `Conn1 Response : ${res.data}`
        document.getElementById('right').append(div)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
    }

    document.getElementById('add-a').addEventListener("click", () => {
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

    document.getElementById('remove-a').addEventListener("click", () => {
        const data = {
            "action": "delete",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('activate-a').addEventListener("click", () => {
        const data = {
            "action": "activate",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('play-a').addEventListener("click", () => {
        const data = {
            "action": "play",
            "body": null
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('pause-a').addEventListener("click", () => {
        const data = {
            "action": "pause",
            "body": null
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('update-a').addEventListener("click", () => {
        const data = {
            "action": "update",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
                "currentTime": 12
            }
        }
        conn.send(JSON.stringify(data))
    })

    const conn2 = new WebSocket('ws://' + host + '/ws')
    conn2.onmessage = (res) => {
        const div = document.createElement('div')
        const br = document.createElement('br')
        div.textContent = `Conn2 Response : ${res.data}`
        document.getElementById('right').append(div)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
        document.getElementById('right').append(br)
    }

    document.getElementById('add-b').addEventListener("click", () => {
        const data = {
            "action": "add",
            "body": {
                "id": "xnPQhqEgkkQ",
                "title": "This is title of song",
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a",
                "index": 1
            }
        }
        conn2.send(JSON.stringify(data))
    })

    document.getElementById('remove-b').addEventListener("click", () => {
        const data = {
            "action": "delete",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn2.send(JSON.stringify(data))
    })

    document.getElementById('activate-b').addEventListener("click", () => {
        const data = {
            "action": "activate",
            "body": {
                "uuid": "705999e4-4c5c-4258-bee0-501eb0a27b3a"
            }
        }
        conn.send(JSON.stringify(data))
    })

    document.getElementById('play-b').addEventListener("click", () => {
        const data = {
            "action": "play",
            "body": null
        }
        conn2.send(JSON.stringify(data))
    })

    document.getElementById('pause-b').addEventListener("click", () => {
        const data = {
            "action": "pause",
            "body": null
        }
        conn2.send(JSON.stringify(data))
    })

    document.getElementById('update-b').addEventListener("click", () => {
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