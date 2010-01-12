/**
 * @author itsbth
 */
var widgets = {}, active = {};

function addWidget(name) {
	if (!widgets[name]) throw new Error("Widget not found");
	widgets[name].create();
}

function initWidget(name, wid, options){
    options = $.extend({
        title: 'N/A',
        hasCSS: false
    }, options);
    
    var widget = $('<li class="ui-widget-content"><h2 class="ui-widget-header">' + options['title'] + '</h2></li>').addClass('widget-' + name).appendTo(".column:first");
    $.get('/widget/' + name + '/html', function(data){
        widget.append($(data));
        wid.onLoad(widget);
    });
    $.getJSON('/widget/' + name + '/add', function(name){
        wid.onAdded(name);
        active[name] = wid;
		console.log("Added widget with name " + name);
    });
    if (options['hasCSS']) {
        $('<link rel="stylesheet" />').attr('href', '/widget/' + name + '/css').appendTo('head');
    }
}

function loadWidget(name, cb){
    $.getScript('/widget/' + name + '/js', cb);
}

function registerWidget(name, tbl){
	widgets[name] = tbl;
}

var loading = false;

function requestCallback(data){
    loading = false;
    for (var cb in data) {
        if (active[cb]) {
            active[cb].onData(data[cb]);
        }
        else {
            //$.get('/widget/' + cb + '/remove');
        }
    }
}

function request(){
    loading = true;
    $.getJSON('/update', requestCallback);
}

var tabOpen = false;

function initEngine(){
    $("#loadingText").remove();
    $("#content").fadeIn('slow');
    $("title").text("Initializing :: {ItsInfoScreen}");
    $(".column").sortable({
        connectWith: ".column",
        placeholder: 'ui-state-highlight'
    });
    bganim();
	loadWidget('cpu', function(){addWidget('cpu');});
    setInterval(request, 500);
	
	$().mousemove(function(e){
		if (tabOpen) return;
		var delta = $("#tab").offset().left - e.pageX;
		if (delta < 100){
			$("#tab").css('opacity', Math.min(1 - delta / 100, 1));
		} else {
			$("#tab").css('opacity', 0);
		}
	});
	$("#tab").click(function(){
		tabOpen = true;
		$("#sidebar").animate({
			opacity: 1,
			width: 320,
		}, 1000);
	});
}

var colors = ["#87CCE8", "#94C4FF", "#A1FCFF", "#87E8D0", "#94FFC7"];

function bganim(){
    $('body').animate({
        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
    }, 10000, bganim);
}

google.setOnLoadCallback(function(){
    initEngine();
});
