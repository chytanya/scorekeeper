define(['backbone', 
        'text!../../templates/game_item.html',
       ], function (
           Backbone,
           GameItemTemplateHTML
       ) {
    
    'use strict';

    var GameView = Backbone.View.extend({
		
		tagName:  'li',
        
        className : 'game',

		// Cache the template function for a single item.
		template: _.template(GameItemTemplateHTML),
        
		// The DOM events specific to an item.
		events: {
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .delete': 'clear',
			'keypress .edit': 'updateOnEnter',
			'blur .edit': 'close'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
            this.$el.attr('data-game-id', this.model.get('id'));
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && app.TodoFilter === 'completed') ||
				(isCompleted && app.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Remove the game, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
    });
           
    return GameView;
});