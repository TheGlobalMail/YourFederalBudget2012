TGM.Views.SidePane = Backbone.View.extend({

    animationSpeed: 150,

    hide: function(done)
    {
        var complete = _.bind(function() {
            this.trigger('hidden');
            done();
        }, this);

        return this.$el.fadeOut({ duration: this.animationSpeed, complete: complete }).promise();
    },

    show: function(done)
    {
        var complete = _.bind(function() {
            this.trigger('shown');
            done();
        }, this);

        return this.$el.fadeIn({ duration: this.animationSpeed, complete: complete }).promise();
    }

});