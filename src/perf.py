'''
Created on 29. nov. 2009

@author: itsbth
'''

import win32pdh

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
    
class CPUProvider(object):
    def __init__(self):
        self._total, self._cores = CPUMeterWin32(), [CPUMeterWin32("0," + str(i)) for i in range(0, 8)]
    
    def update(self):
        return [self._total.update(), [round(c.update(), 1) for c in self._cores]]
    
class TopFiveProvider(object):
    pass