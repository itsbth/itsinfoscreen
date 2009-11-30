'''
Created on 29. nov. 2009

@author: itsbth
'''
import cherrypy
import json
import random
import perf

expose = cherrypy.expose

dataproviders = [('cpu', perf.CPUProvider())]

class DataProvider(object):
    pass

class HelloWorld:
    @expose
    def index(self):
        return "Hello world!"
    
    @expose
    def update(self):
        dat = {}
        for name, p in dataproviders:
            ret = p.update()
            if ret is not None:
                dat[name] = ret
        return json.dumps(dat)

if __name__ == '__main__':
    cherrypy.quickstart(HelloWorld(), config='config.ini')