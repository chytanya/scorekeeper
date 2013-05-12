define(['backbone', 'models/game', 'backbone.localStorage'], function (Backbone, Game, LocalStorage) {

    'use strict';

    var GameList = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Game,

        // Save all of the games items under the `"scorekeeper"` namespace.
        localStorage: new LocalStorage('scorekeeper.games'),

        // Filter down the list of all games that are not finished.
        current: function () {
            var filtered = this.filter(function (game) {
                return !game.get('completed');
            });

            return new GameList(filtered);
        },

        // We keep the Games in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: function (todo) {
            return games.get('order');
        }
    });

    var games = new GameList();
    return games;
});