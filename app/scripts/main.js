require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        moment : '../components/moment/moment',
        underscore : '../components/underscore/underscore',
        backbone : '../components/backbone/backbone',
        'backbone.localStorage' : 'vendor/backbone.localStorage',
        text : '../components/text/text'
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
        localStorage: {
            deps : ['underscore', 'backbone'],
            exports : 'Backbone'
        }
    }
});

require(['jquery', 'moment', 'app'], function ($, moment, appView) {
    
    'use strict';

    $('#new-player-add-btn').live('click', function(e){
        var modal = $(e.target).parents('#new-player-form');
        var playerName = $(modal).find('#new-player-name-input').val();
        appView.addNewPlayer(playerName);
        $(modal).modal('hide');
        appView.showAddNewGame();
    });

});


