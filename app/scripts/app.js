define([
        'backbone',
        'collections/games', 'collections/users',
        'views/game',
        'text!../templates/no_games.html',
        'text!../templates/create_new_game.html'
    ], function (
            Backbone,
            games, users,
            GameView,
            noGamesTemplateHTML,
            createNewGameTemplateHTML
        ){

    'use strict';
    
    var AppView = Backbone.View.extend({
        
        el : $('#app'),
        
        noGamesTemplate : _.template(noGamesTemplateHTML),
        
        createNewGameTemplate : _.template(createNewGameTemplateHTML),
        
        events: {
            'click #no-games'       :   'showAddNewGame',
            'click #create-game'    :   'createNewGame',
            'click .game'           :   'showGame',
            'click #add-new-player' :   'showAddNewPlayer',
            'click #available-players .player'     :   'addPlayerToNewGame'
        },
        
        initialize : function(){
            
            //this.$main = this.$('#main');
            
            this.listenTo(games, 'add', this.addOne);
            this.listenTo(games, 'reset', this.addAll);
            this.listenTo(games, 'all', this.render);
            
            games.fetch();

        },
        
        render: function(){
            
            console.log('in render');
            
            /*
            games.create([
              { name: "Least Count", players : [], winner : null }
            ]);
            _.invoke(games.models, 'destroy');
            */

            if(games.length) {
                
                console.log(games);
                
            } else {
                $('#game-list').html(this.noGamesTemplate({}));
            }
            
        },
        
        addOne: function (game) {
            var view = new GameView({ model: game });
            $('#game-list').append(view.render().el);
        },

        // Add all items in the **games** collection at once.
        addAll: function () {
            this.$('#game-list').html('');
            games.each(this.addOne, this);
        },
        
        showAddNewGame: function(){
            
            /*
            var game =  games.create({ name: 'Untitled Game', players : [], winner : null, created : '' });
            $('#app').html(this.createNewGameTemplate({ game : game.toJSON() })); 
            */

            var player1 = { id : 1, name : 'User1' };
            var player2 = { id : 2, name : 'User2' };
            var player3 = { id : 3, name : 'User3' };
            var player4 = { id : 4, name : 'User4' };
            users.add(player1);
            users.add(player2);
            users.add(player3);
            users.add(player4);

            var game =  { name: 'Untitled Game', players : [], winner : null, created : '' };
            $('#app').html(this.createNewGameTemplate({ game : game, allPlayers : users.toJSON() })); 

        },
        
        createNewGame: function(){
            var name = $('#new-game-name').val().trim();
            var players = [];

            $.each($('.player.selected'), function() {
                var playerId =  $(this).attr('data-player-id');
                if(!playerId){ alert('Invalid Player.'); return false; }
                players.push(users.get(playerId));
            });

            games.create({ name: name, players : players, winner : null });
            this.initialize();
        },
        
        showGame: function(e){
            var gameId = $(e.target).closest('.game').attr('data-game-id');
            if(gameId){
                var game = games.get(gameId);
                var view = new GameView({ model: game });
                $('#app').html(view.renderDetails().el);
            }else{
                alert('no such game!');   
            }
        },

        addPlayerToNewGame: function(e){

            var player  =   $(e.target).closest('.player');
            $(player).toggleClass('selected')
        },
        
        showAddNewPlayer: function(e){
            $('<input>').attr({
                        type: 'text',
                        name: 'new-player'
                    }).appendTo('#new-game-player-list');
        }
        
    });

    return AppView;
});