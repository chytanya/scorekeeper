define([
        'bootstrap',
        'backbone',
        'collections/games', 'collections/users',
        'views/game',
        'views/gameDetails',
        'text!../templates/no_games.html',
        'text!../templates/create_new_game.html',
        'text!../templates/new_player.html',
    ], function (
            Bootstrap,
            Backbone,
            games, allPlayers,
            GameView, GameDetailView,
            noGamesTemplateHTML,
            createNewGameTemplateHTML,
            newPlayerTemplateHTML
        ){

    'use strict';
    
    var AppView = Backbone.View.extend({
        
        el : $('#app'),
        
        noGamesTemplate : _.template(noGamesTemplateHTML),
        
        createNewGameTemplate : _.template(createNewGameTemplateHTML),

        newPlayerTemplate : _.template(newPlayerTemplateHTML),
        
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
                        
            /*
                _.invoke(games.models, 'destroy');
                this.deleteAppData();
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
            $('#app').html('<div class="row"><div class="span12" id="game-list"></div></div>');
            this.$('#game-list').html('');
            games.each(this.addOne, this);
            $('#show-add-new-game').show();
        },
        
        showAddNewGame: function(){
            
            allPlayers.fetch();
            var selectedPlayers = [];

            var newGameName = $('#new-game-name').val();
            $('.player.selected').each(function(){
                selectedPlayers.push(allPlayers.get($(this).attr('data-player-id')));
            });

            var game =  { name: newGameName, players : selectedPlayers, winner : null };
            $('#app').html(this.createNewGameTemplate({ 
                                            game                :   game, 
                                            allPlayers          :   allPlayers.toJSON()
                                        })); 

        },
        
        createNewGame: function(){
            var name = $('#new-game-name').val().trim();
            var players = [];

            $.each($('.player.selected'), function() {
                var playerId =  $(this).attr('data-player-id');
                if(!playerId){ alert('Invalid Player.'); return false; }
                players.push(allPlayers.get(playerId));
            });

            games.create({ name: name, players : players, winner : null });
            this.addAll();
        },
        
        showGame: function(e){
            var gameId = $(e.target).closest('.game').attr('data-game-id');
            if(gameId){
                var game = games.get(gameId);
                var view = new GameDetailView({ model: game });
                $('#app').html(view.render().el);
            }else{
                alert('no such game!');   
            }
        },

        addPlayerToNewGame: function(e){

            var player  =   $(e.target).closest('.player');
            $(player).toggleClass('selected')
        },
        
        showAddNewPlayer: function(e){
            if($('#new-player-form').length == 0){
                $('#app').append(this.newPlayerTemplate({}));
            }
            $('#new-player-form').modal();
            $('#new-player-form').modal('show');
        },

        addNewPlayer: function(playerName){
            var newPlayer = allPlayers.create({ name : playerName });
        },

        deleteAllPlayers: function(){
            localStorage.removeItem('scorekeeper.users');   
        },

        deleteAllGames: function(){
            localStorage.removeItem('scorekeeper.games');   
        },

        deleteAppData: function(){
            this.deleteAllGames();
            this.deleteAllPlayers();
        }
        
    });

    var app = new AppView();

    $('#show-add-new-game').on('click', function(e){
        app.showAddNewGame(); 
    });
    
    $('.brand').on('click', function(e){
        app.addAll(); 
    });

    return app;
});