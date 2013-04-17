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

require(['jquery', 'moment', 'app'], function ($, moment, AppView) {
    
    'use strict';

    var appView = new AppView();
    
    $('#show-add-new-game').on('click', function(e){
        appView.showAddNewGame(); 
    });
    
    $('.brand').on('click', function(e){
        appView.initialize(); 
    });

});


