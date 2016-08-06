from hayeonsoo.container import Container
from hayeonsoo.utils import MessageType

from . import api_response


api_v1 = Container()


@api_v1.route('/status')
def status(request):
    return api_response()


@api_v1.route('/ws', is_websocket=True)
async def web_socket(request, ws):
    await ws.prepare(request)
    async for message in ws:
        if message.tp == MessageType.text:
            if message.data == 'close':
                await ws.close()
            else:
                pass
    return ws

