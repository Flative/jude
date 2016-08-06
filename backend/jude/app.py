from hayeonsoo import Hayeonsoo

from .api.v1 import api_v1


app = Hayeonsoo()
app.register_container(api_v1, prefix='/api/v1')
