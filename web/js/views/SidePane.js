TGM.Views.SidePane = Backbone.View.extend({

    animationSpeed: 150,

    hide: function(done)
    {
        this.trigger('hide');

        var complete = _.bind(function() {
            this.$el.css({ opacity: 0, display: 'none' });
            this.trigger('hidden');
            done && done();
        }, this);

        return this.$el.transition({ opacity: 0, duration: this.animationSpeed, complete: complete }).promise();
    },

    show: function(done)
    {
        this.trigger('show');
        this.$el.css({ opacity: 0, display: 'block' });

        var complete = _.bind(function() {
            this.trigger('shown');
            done && done();
        }, this);

        return this.$el.transition({ opacity: 1, duration: this.animationSpeed, complete: complete }).promise();
    },

    getTab: function()
    {
        return this.$el.data('tab');
    }

});