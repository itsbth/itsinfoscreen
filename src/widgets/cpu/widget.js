(function ($) {
	var cpuc = [];
	for (var i = 0; i < 8; i++) {
	    cpuc[i] = [];
	}
	
	widget.Register('cpu', {
		title: 'CPU Usage',
		hasCSS: true,
	    init: function(wid){
			wid.children('.cputot').progressbar();
	    },
	    update: function(cdata){
	        $(".cputot").progressbar('option', 'value', cdata[0]);
	        var data = cdata[1];
	        for (var i = data.length - 1; i >= 0; i--) {
	            cpuc[i].push(data[i]);
	            if (cpuc[i].length > 20) 
                	cpuc[i].shift();
	            $(".cpuline" + i).sparkline(cpuc[i], {
	                'chartRangeMin': 0,
	                'chartRangeMax': 100
	            });
	        }
	    }
	});
})(jQuery);
