TGM.Views.SidePaneView = Backbone.View.extend({

    animationSpeed: 150,

    hide: function(done)
    {
        return this.$el.fadeOut({ duration: this.animationSpeed, complete: done }).promise();
    },

    show: function(done)
    {
        return this.$el.fadeIn({ duration: this.animationSpeed, complete: done }).promise();
    }

});