define(['backbone'], function (Backbone) {
    
    'use strict';

    var Game = Backbone.Model.extend({

        defaults: {
            name: '',
            players: [],
            winner : null,
            created : moment().format('YYYY-MM-DD, HH:mm:ss')
        }

    });

    return Game;
});