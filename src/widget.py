'''
Created on 13. des. 2009

@author: itsbth
'''

class WidgetBase(object):
    '''
    classdocs
    '''

    def __init__(self, app, name):
        '''
        Constructor
        '''
        self._name = name
        self._app = app
    
    def queue_data(self, name, data):
        self._app.queue_data(self._name, name, data)
        
class WidgetManager(object):
    widgets = []
    queue = {}
    nwid = 0
    
    def __init__(self):
        pass
    
    def update(self):
        ret = self.queue.copy()
        self.queue.clear()
        return ret
    
    def add(self, name):
        mod = __import__('widgets.' + name)
        wname = name + str(self.nwid)
        self.nwid += 1
        self.widgets.append((name, getattr(mod, name).Widget(self, wname)))
        return wname
    
    def queue_data(self, widget, name, value):
        self.queue.setdefault(widget, []).append((name, value))