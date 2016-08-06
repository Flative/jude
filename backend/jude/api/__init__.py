from hayeonsoo.http import response


def api_response(data:dict={}, message:str="", status_code:int=200):
    result = {
        'status': 'success' if 200 <= status_code < 300 else 'error',
        'data': data,
        'message': message
    }
    return response(body=result, content_type='application/json', status_code=status_code)
