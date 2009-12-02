/**
 * @author itsbth
 */
function widgetproto(){
    this.callbacks = {};
    this.Register = function(name, options){
        options = $.extend({
            title: 'N/A',
            hasCSS: false
        }, options);
        if (options['update']) 
            this.callbacks[name] = options['update'];
		
        var widget = $('<li class="ui-widget-content"><h2 class="ui-widget-header">' + options['title'] + '</h2></li>').addClass('widget-' + name).appendTo(".column:first");
        $.get('/widget/' + name + '/html', function(data){
            widget.append($(data));
            if (options['init']) 
                options['init'](widget);
        });
        if (options['hasCSS']) {
            $('<link rel="stylesheet" />').attr('href', '/widget/' + name + '/css').appendTo('head');
        }
    }
    this.Load = function(name){
        $.getScript('/widget/' + name + '/js');
        $.get('/widget/' + name + '/add');
    }
    
    var loading = false;
    
    this.Callback = function(data){
        console.dir(data);
		console.dir(this.callbacks);
        loading = false;
        for (var cb in data) {
            if (this.callbacks[cb]) {
                this.callbacks[cb](data[cb]);
            } else {
				//$.get('/widget/' + cb + '/remove');
			}
        }
    }
    
    this.Request = function(){
        loading = true;
        $.getJSON('/update', function(data){
            widget.Callback(data);
        });
    }
    
    this.Init = function(){
        $("#loadingText").remove();
        $("#content").fadeIn('slow');
        $("title").text("Initializing :: {ItsInfoScreen}");
        $(".column").sortable({
            connectWith: ".column",
            placeholder: 'ui-state-highlight'
        });
        bganim();
        setInterval(this.Request, 500);
    }
    
    var colors = ["#87CCE8", "#94C4FF", "#A1FCFF", "#87E8D0", "#94FFC7"];
    
    function bganim(){
        $('body').animate({
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
        }, 10000, bganim);
    }
}

widget = new widgetproto();

function init(){
    widget.Init();
    widget.Load('cpu');
}

google.setOnLoadCallback(init);
