define([
        'bootstrap',
        'backbone',
        'collections/games', 'collections/users',
        'views/game',
        'views/gameDetails',
        'text!../templates/no_games.html',
        'text!../templates/create_new_game.html',
        'text!../templates/new_player.html',
        'text!../templates/players.html'
    ], function (
            Bootstrap,
            Backbone,
            games, allPlayers,
            GameView, GameDetailView,
            noGamesTemplateHTML,
            createNewGameTemplateHTML,
            newPlayerTemplateHTML,
            playersTemplate
        ){

    'use strict';
    
    var AppView = Backbone.View.extend({
        
        el : $('#app'),
        
        noGamesTemplate : _.template(noGamesTemplateHTML),
        
        createNewGameTemplate : _.template(createNewGameTemplateHTML),

        newPlayerTemplate : _.template(newPlayerTemplateHTML),

        playersTemplate : _.template(playersTemplate),
        
        events: {
            'click #no-games'       :   'showAddNewGame',
            'click #create-game'    :   'createNewGame',
            'click .game'           :   'showGame',
            'click #add-new-player' :   'showAddNewPlayer',
            'click #available-players .player'     :   'addPlayerToNewGame',

            //manage players page
            'click #players .player .delete'    :   'deletePlayer'
        },
        
        initialize : function(){
            
            //this.$main = this.$('#main');
            
            this.listenTo(games, 'add', this.addOne);
            this.listenTo(games, 'all', this.render);
            this.listenTo(games, 'reset', this.addAll);

            games.fetch();
        },
        
        render: function(){

            if(!games.length) {
                $('#game-list').html(this.noGamesTemplate({}));
            }
            
        },

        addOne: function (game) {
            var view = new GameView({ model: game });
            if(game.get('completed')){ $(view.render().el).addClass('completed'); }
            $('#game-list').append(view.render().el);
        },

        // Add all items in the **games** collection at once.
        addAll: function () {

            //games.current();
            $('#app').html('<div class="row"><div class="span12" id="game-list"></div></div>');
            $('#game-list').html('');
            games.each(this.addOne);

            $('#page-title-wrapper').text('HOME');
        },

        showAllIncludingCompleted: function(){
            games.fetch();
            this.addAll();
        },

        showAll: function(){
            games = games.current();
            this.addAll();
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
            //$('#new-game-name').focus();
            $('.close.view-close').attr('id', 'close-new-game-creation').show();

            $('#page-title-wrapper').text('NEW GAME');
        },

        managePlayers: function(){
            allPlayers.fetch();
            $('#app').html(this.playersTemplate({ players : allPlayers.toJSON() }));
            $('#page-title-wrapper').text('PLAYERS');
        },

        deletePlayer: function(e){
            var playerDom  = $(e.target).closest('.player');
            var playerId = $(playerDom).attr('data-player-id');
            allPlayers.get(playerId).destroy();
            allPlayers.reset();
            $(playerDom).remove();
        },
        
        createNewGame: function(){
            var name = $('#new-game-name').val().trim();

            // give a default name
            if(!name){ 
                name = 'Untitled Game';
            }

            var players = [];

            if($('.player.selected').length == 0){
                $('#select-player-msg').show();
                return false;
            }

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
            $('#page-title-wrapper').text(game.get('name'));
            $('.close.view-close').attr('id', 'close-current-game').show();
        },

        addPlayerToNewGame: function(e){
            var player  =   $(e.target).closest('.player');
            $(player).toggleClass('selected')
        },
        
        showAddNewPlayer: function(e){
            if($('#new-player-form').length == 0){
                $(this.newPlayerTemplate({})).appendTo($('body'));
            }
            $('#new-player-form').modal();
            $('#new-player-form').modal('show');
            $('#new-player-form #new-player-name-input').val('');
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
        },

        showSettings: function(){
            $('#page-title-wrapper').text('SETTINGS');
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