define(['backbone', 
        '../collections/users',
        'text!../../templates/game_item_details.html'
       ], function (
           Backbone,
           Players,
           GameDetailsTemplateHTML
       ) {
    
    'use strict';


    var GameDetailsView = Backbone.View.extend({
        
        tagName:  'div',
        
        id : 'game-details',

        template: _.template(GameDetailsTemplateHTML),
        
        events: {
            'click .add_score'  :   'showAddScore',
            'keypress .score_input' : 'addScore'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'all', this.render);
            $('#show-add-new-game').hide();
        },

        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            Players.add(this.model.get('players'));
            return this;
        },

        showAddScore: function(e){

            $(e.target).hide();
            $(e.target).siblings('.score_input_wrapper').show();
        },

        addScore: function(e){
            if(e.which == 13){
                var playerId = $(e.target).closest('.player').attr('data-player-id');
                this.addScoreToPlayer(playerId, $(e.target).val());

                $(e.target).parent('.score_input_wrapper').hide();
                $(e.target).parent('.score_input_wrapper').siblings('.add_score').show();
            }
        },

        addScoreToPlayer: function(playerId, score){
            var Player = Players.get(playerId);

            var scores = Player.get('scores');
            scores.push(score);

            Player.set('scores', scores);

            this.updateModelData();

        },

        updateModelData: function(){
            this.model.set('players', Players.toJSON());
            this.model.save();
        }

    });
           
    return GameDetailsView;
});