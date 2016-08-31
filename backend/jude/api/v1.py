import json

from sqlalchemy.orm.exc import NoResultFound
from hayeonsoo.container import Container

from . import api_response
from ..db import session
from ..models import PlayList


api_v1 = Container()


@api_v1.route('/status')
def status(request):
    return api_response()


WSS = []
STATUS = {'pk': PlayList.get_current_playing_pk(), 'action': 'stop', 'seconds': 0.0}


def notify_all(data):
    for ws in WSS:
        try:
            ws.send_json(data)
        except RuntimeError:
            WSS.remove(ws)


def notify_current_to_all():
    notify_all({'success': True, 'lists': PlayList.get_current_lists(), 'status': STATUS})


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

                notify_current_to_all()

            elif data['command'] == 'delete':
                song_pk = values.get('spk', '')

                session.query(PlayList).filter(PlayList.id==song_pk).delete()
                session.commit()

                notify_current_to_all()

        elif data['category'] == 'control':
            if data['command'] in ('start', 'stop'):
                STATUS['action'] = data['command']
                notify_current_to_all()

            elif data['command'] == 'change':
                try:
                    song_pk = values.get('spk', '')
                    song_pk = session.query(PlayList).filter(PlayList.id==song_pk).id
                    STATUS['pk'], STATUS['action'] = song_pk, 'start'

                    notify_current_to_all()
                except NoResultFound:
                    pass

    return ws

