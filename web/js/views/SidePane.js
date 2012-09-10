TGM.Views.SidePane = Backbone.View.extend({

    animationSpeed: 150,

    hide: function(done)
    {
        this.trigger('hide');

        var complete = _.bind(function() {
            this.trigger('hidden');
            done();
        }, this);

        return this.$el.fadeOut({ duration: this.animationSpeed, complete: complete }).promise();
    },

    show: function(done)
    {
        this.trigger('show');

        var complete = _.bind(function() {
            this.trigger('shown');
            done();
        }, this);

        return this.$el.fadeIn({ duration: this.animationSpeed, complete: complete }).promise();
    },

    getTab: function()
    {
        return this.$el.data('tab');
    }

});