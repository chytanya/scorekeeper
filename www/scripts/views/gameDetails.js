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
            'click .update'         :   'showAddScore',
            'click .add'            :   'addScore',
            'click .subtract'       :   'subtractScore',
            'click #end-game'       :   'endCurrentGame'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'all', this.render);
        },

        render: function(){
            Players.reset();       
            this.$el.html(this.template(this.model.toJSON()));
            $('#page-title').text(this.model.get('name'));
            Players.add(this.model.get('players'));
            return this;
        },

        showAddScore: function(e){
            $(e.target).closest('.player').find('.score_change_wrapper').show();
        },

        addScore: function(e){
            var playerId = $(e.target).closest('.player').attr('data-player-id');
            this.addScoreToPlayer(playerId, $(e.target).closest('.player').find('.score_input').val());

            $(e.target).parent('.score_change_wrapper').hide();
        },

        subtractScore: function(e){
            var playerId = $(e.target).closest('.player').attr('data-player-id');
            this.subtractScoreToPlayer(playerId, $(e.target).closest('.player').find('.score_input').val());

            $(e.target).parent('.score_change_wrapper').hide();
        },

        addScoreToPlayer: function(playerId, score){
            var Player = Players.get(playerId);

            var scores = Player.get('scores');
            scores.push(score);

            Player.set('scores', scores);
            this.updateModelData();

        },

        subtractScoreToPlayer: function(playerId, score){
            var Player = Players.get(playerId);

            var scores = Player.get('scores');
            scores.push("-" + score);

            Player.set('scores', scores);
            this.updateModelData();
        },

        updateModelData: function(){

            _.each(Players.models, function(Player){
                var playerScores = Player.get('scores');
                var totalPlayerScore = _.reduce(playerScores, function(memo, num){ return parseInt(memo) + parseInt(num); },0);
                Player.set('total_score', totalPlayerScore);
            });

            this.model.set('players', Players.toJSON());
            this.model.save();
        },

        endCurrentGame: function(e){

            // set the winner by high score
            var winner = _.max(Players.models, function(player){ return player.get('total_score'); });
            this.model.set('winner', winner);

            // set the game as completed
            this.model.set('completed', moment().format('YYYY-MM-DD, HH:mm:ss'));

            this.model.save();
            $(e.target).closest('.end-game-wrapper').hide();
        }

    });
           
    return GameDetailsView;
});