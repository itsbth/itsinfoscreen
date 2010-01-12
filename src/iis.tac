import os, sys
sys.path.append(os.getcwd())

from twisted.application import service, internet

from nevow import appserver
from nevow import rend
from nevow import inevow
from nevow.static import File, Data

import json, random

from widget import WidgetManager

man = WidgetManager()

class JSONData(rend.Page):
    isLeaf = True
    def __init__(self, data):
        self.data = json.dumps(data)
    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader("content-type", "text/json")
        request.setHeader("content-length", str(len(self.data)))
        return self.data

class Update(rend.Page):
    def renderHTTP(self, ctx):
        global man
        return json.dumps(man.update())

class WidgetHandler(rend.Page):
    def locateChild(self, ctx, segments):
        name, action = segments
        if action in ('html', 'js', 'css'):
            return (File('./widgets/' + name + '/widget.' + action), ())
        elif action == 'add':
            global man
            return (JSONData(man.add(name)), ())
        elif action == 'remove':
            pass
        return (MainPage(), ())


class MainPage(rend.Page):
    children = {'static': File('./static'), 'update': Update(), 'widget': WidgetHandler()}
    def renderHTTP (self, ctx):
        return 'N/A'

######################################################################
# Nevow Boilerplate
######################################################################

application = service.Application("itsinfoscreen")
port        = 8080
res         = MainPage()
site        = appserver.NevowSite(res)
webService  = internet.TCPServer(port, site)
webService.setServiceParent(application)