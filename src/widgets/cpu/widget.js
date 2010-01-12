registerWidget('cpu', {
    title: 'CPU Usage',
    hasCSS: true,
    create: function(){
        wid = {
            onAdded: function(){
            },
            onLoad: function(wid){
                this.div = $(wid);
                wid.find('.cputot').progressbar();
            },
            onData: function(data){
                for (var i = 0; i < data.length; i++) {
					cdata = data[i];
                    switch (cdata[0]) {
                        case 'cpucount':
						    console.log("cpucount: " + cdata[1]);
                            this.cpuLog = [];
                            this.cpuCount = cdata[1];
                            for (var i = 0; i < cdata[1]; i++) {
                                this.cpuLog[i] = [];
                                $('<li><strong>Core ' + i + ': </strong><span class="cpuline' + i + '"></span></li>').appendTo(this.div.find('.cpu-ul'));
                            }
                            break;
                        case 'total_pc':
                            this.div.find(".cputot").progressbar('option', 'value', cdata[1]);
                            break;
                        case 'core_pc':
                            if (!this.cpuCount) 
                                return;
                            var data = cdata[1];
                            for (var i = data.length - 1; i >= 0; i--) {
                                this.cpuLog[i].push(data[i]);
                                if (this.cpuLog[i].length > 20) 
                                    this.cpuLog[i].shift();
                                this.div.find(".cpuline" + i).sparkline(this.cpuLog[i], {
                                    'chartRangeMin': 0,
                                    'chartRangeMax': 100
                                });
                            }
                            break;
                        default:
                            break;
                    }
                };
                            }
        }
        initWidget('cpu', wid, this);
    }
});

