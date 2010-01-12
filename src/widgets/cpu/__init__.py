'''
Created on 29. nov. 2009

@author: itsbth
'''

from widget import WidgetBase
from twisted.internet.task import LoopingCall

import win32pdh
from multiprocessing import cpu_count

class CPUMeterWin32(object):
    """Averages CPU utilization over an update_interval."""
    
    def __init__(self, instance = "_Total"):
        inum = -1
        machine = None
        self.format = win32pdh.PDH_FMT_DOUBLE
        object = "Processor Information"
        counter = "% Processor Time"
        path = win32pdh.MakeCounterPath( (machine, object, instance,
                                          None, inum, counter) )
        self.hq = win32pdh.OpenQuery()
        try:
            self.hc = win32pdh.AddCounter(self.hq, path)
        except:
            self.close()
            raise
        win32pdh.CollectQueryData(self.hq)

    def close(self):
        if self.hc:
            try:
                win32pdh.RemoveCounter(self.hc)
            except:
                pass
            self.hc = None
        if self.hq:
            try:
                win32pdh.CloseQuery(self.hq)
            except:
                pass
            self.hq = None        

    def _get_stats(self):
        win32pdh.CollectQueryData(self.hq)
        type, val = win32pdh.GetFormattedCounterValue(self.hc, self.format)
        return val
        
    def update(self):
        return self._get_stats()
    
class Widget(WidgetBase):
    def __init__(self, app, name):
        WidgetBase.__init__(self, app, name)
        self._core_count = cpu_count()
        # Assume only one CPU
        self._total, self._cores = CPUMeterWin32(), [CPUMeterWin32("0," + str(i)) for i in range(0, self._core_count)]
        self.queue_data('cpucount', self._core_count)
        self._task = LoopingCall(self._update)
        self._task.start(0.5)
    
    def close(self):
        self._task.stop()
        self._total.close()
        for core in self._cores:
            core.close()
    
    def _update(self):
        self.queue_data('total_pc', self._total.update())
        self.queue_data('core_pc', [round(c.update(), 1) for c in self._cores])