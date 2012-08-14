TGM.Views.CategoryAllocationView = Backbone.View.extend({

    events: {
        "slide .slider-control": "onSlide",
        "slidechange .slider-control": "onSlide",
        "slidestop .slider-control": "onSlide"
    },

    initialize: function(options)
    {
        _.bindAll(this, 'refreshAmount');
        this.$slider = this.$('.slider-control').slider(DATA.sliderConfig);
        this.model.on("change:" + options.category, this.refreshAmount);
    },

    onSlide: function(e, ui)
    {
        this.model.set(this.options.category, ui.value);
    },

    refreshAmount: function(model, value)
    {
        this.$('.amount').text(value);
    }

});