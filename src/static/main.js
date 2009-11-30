/**
 * @author itsbth
 */

var cpuc = [];
for	(var i = 0; i < 8; i++) {
	cpuc[i] = [];
}

var callbackTable = {
	'cpu': function (cdata) {
		$("#cputot").progressbar('option', 'value', cdata[0]);
		var data = cdata[1];
		for (var i = data.length - 1; i >= 0; i--) {
			cpuc[i].push(data[i]);
			if (cpuc[i].length > 20) cpuc[i].shift();
			$("#cpuline" + i).sparkline(cpuc[i], {
				'chartRangeMin': 0,
				'chartRangeMax': 100
			});
		}
	}
};

function bgAnim () {
	$('body').animate({
		backgroundColor: colors[Math.floor(Math.random() * colors.length)] 
	}, 10000, bgAnim);
}

var initCallbacks = [
	function () {
		$("#cputot").progressbar({value: 0});
	},
	bgAnim
];

var loading = false;

function callback (data) {
	loading = false;
	for (var cb in data) {
		if (callbackTable[cb]) {
			callbackTable[cb](data[cb]);
		}
	}
}

function request () {
	loading = true;
	$.getJSON('/update', callback);
}

var colors = ["#87CCE8", "#94C4FF", "#A1FCFF", "#87E8D0", "#94FFC7"];

function init () {
	$("#loadingText").remove();
	$("#content").fadeIn('slow');
	$("title").text("Initializing :: {ItsInfoScreen}");
	/*
	$(".draggable").draggable({
			grid: [220, 100]
		});
	*/
	$(".column").sortable({connectWith: ".column", placeholder: 'ui-state-highlight'});
	
	for (var i = initCallbacks.length - 1; i >= 0; i--){
		initCallbacks[i]();
	};
	
	setInterval(request, 500);
	// setTimeout(function () { window.location.reload(true); }, 60000);
}

google.setOnLoadCallback(init);
