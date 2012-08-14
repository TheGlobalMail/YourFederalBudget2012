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
        this.category = DATA.categories[options.category];
        this.render();
    },

    onSlide: function(e, ui)
    {
        this.model.set(this.options.category, ui.value);
    },

    refreshAmount: function(model, value)
    {
        this.$('.amount').val(value);
    },

    placeFederalAllocation: function()
    {
        var federalAllocation = this.category.federalAllocation;
        var $federalAllocation = this.$('.federal-allocation');
        var maxAmount = DATA.sliderConfig.max;
        var sliderWidth = this.$slider.width();
        var federalAllocationOffsetPercentage = federalAllocation / maxAmount;

        $federalAllocation.css('left', sliderWidth * federalAllocationOffsetPercentage);
    },

    render: function()
    {
        this.$('.info-icon').tooltip({ title: this.category.tooltip, placement: "right" });
        this.refreshAmount(null, this.$slider.slider('value'));
        this.placeFederalAllocation();
    }

});