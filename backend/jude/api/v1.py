import json

from hayeonsoo.container import Container

from . import api_response
from ..db import session
from ..models import PlayList


api_v1 = Container()


@api_v1.route('/status')
def status(request):
    return api_response()


WSS = []
def notify_all(data):
    for ws in WSS:
        try:
            ws.send_json(data)
        except RuntimeError:
            WSS.remove(ws)


@api_v1.route('/ws', is_websocket=True)
async def web_socket(request, ws):
    await ws.prepare(request)

    WSS.append(ws)

    async for message in ws:
        try:
            data = json.loads(message.data)
            if data.get('conn', '') == 'close':
                raise ValueError
        except ValueError:
            await ws.close()

        values = data['value']

        if data['category'] == 'playlist':
            if data['command'] == 'add':
                title = values.get('title', '')
                song_id = values.get('sid', '')

                session.add(PlayList(title=title, song_id=song_id))
                session.commit()

                notify_all({'success': True, 'lists': PlayList.get_current_lists()})
            elif data['command'] == 'delete':
                song_pk = values.get('spk', '')

                session.query(PlayList).filter(PlayList.id==song_pk).delete()
                session.commit()

                notify_all({'success': True, 'lists': PlayList.get_current_lists()})
    return ws

