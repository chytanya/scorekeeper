require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        moment : '../components/moment/moment',
        underscore : '../components/underscore/underscore',
        backbone : '../components/backbone/backbone',
        fastClick : '../components/fastclick/lib/fastclick',
        'backbone.localStorage' : 'vendor/backbone.localStorage',
        text : '../components/text/text',
        snap : 'vendor/snap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        backbone : {
            deps : ['underscore'],
            exports : 'Backbone'
        },
        underscore: {
            deps : ['jquery'],
            exports : '_'
        },
        fastClick: {
            deps : ['jquery'],
            exports : 'FastClick'
        },
        localStorage: {
            deps : ['underscore', 'backbone'],
            exports : 'Backbone'
        }
    }
});

require(['jquery', 'moment', 'snap', 'fastClick', 'app'], function ($, moment, Snap, FastClick, appView) {
    
    'use strict';

    $(function() {
        FastClick.attach(document.body);
    });

    $('#new-player-add-btn').live('click', function(e){
        var modal = $(e.target).parents('#new-player-form');
        var playerName = $(modal).find('#new-player-name-input').val();
        if(!playerName) {
            $(e.target).addClass('validation_error');
            return false;
        }
        appView.addNewPlayer(playerName);
        $(modal).modal('hide');
        appView.showAddNewGame();
    });

    var snapper = new Snap({
        element: document.getElementById('content')
    });

    var settings = {
                    maxPosition: 180,
                    disable: 'right'
                };
    snapper.settings(settings);

    $('#open-left').live('click', function(){

        if( snapper.state().state=="left" ){
            snapper.close();
        } else {
            snapper.open('left');
        }
    });

    $('#all-games').live('click', function(){
        appView.showAllIncludingCompleted();
    });

    $('#current-games').live('click', function(){
        appView.showAll();
    });

    $('#show-add-new-game').live('click', function(){
        appView.showAddNewGame();
    });

    $('#settings').live('click', function(){
        appView.showSettings();
    });
    
    $('#players').live('click', function(){
        appView.managePlayers();
    });

    $('.nav-item').live('click', function(){
        snapper.close();
    });

    $('.close.view-close').live('click', function(){
        appView.showAll();
        $('.close.view-close').removeAttr('id').hide();
    });

});


