define(['backbone'], function (Backbone) {
    
    'use strict';

    var User = Backbone.Model.extend({

        defaults: {
            name: '',
            scores: [],
            total_score : 0,
            created : moment().format('YYYY-MM-DD, HH:mm:ss')
        }

    });

    return User;
});