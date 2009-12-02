import os, sys
sys.path.append(os.getcwd())

from twisted.application import service, internet

from nevow import appserver
from nevow import rend
from nevow.static import File

import json
import random
import perf

widgets = []

class DataProvider(object):
    pass

class Update(rend.Page):
    def renderHTTP(self, ctx):
        dat = {}
        for name, p in widgets:
            ret = p.update()
            if ret is not None:
                dat[name] = ret
        return json.dumps(dat)

class WidgetHandler(rend.Page):
    def locateChild(self, ctx, segments):
        print 'WidgetHandler.locateChild', repr(segments)
        name, action = segments
        if action in ('html', 'js', 'css'):
            return (File('./widgets/' + name + '/widget.' + action), ())
        elif action == 'add':
            mod = __import__('widgets.' + name)
            widgets.append((name, getattr(mod, name).Widget()))
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

application = service.Application ( "nevowdemo1" )
port        = 8080
res         = MainPage()
site        = appserver.NevowSite ( res )
webService  = internet.TCPServer ( port, site )
webService.setServiceParent ( application )