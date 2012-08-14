TGM.Views.CategoryAllocationView = Backbone.View.extend({

    events: {
        "slide .slider-control": "onSlide",
        "slidestop .slider-control": "onSlide",
        "keyup .amount": "onManualEntry"
    },

    initialize: function(options)
    {
        _.bindAll(this, 'refreshAmount');
        this.$slider = this.$('.slider-control').slider(DATA.sliderConfig);
        this.$amount = this.$('.amount');
        this.model.on("change:" + options.category, this.refreshAmount);
        this.category = DATA.categories[options.category];
        this.render();
    },

    onSlide: function(e, ui)
    {
        this.model.set(this.options.category, ui.value);
    },

    onManualEntry: function()
    {
        var newVal = this.$amount.val();

        if (newVal.length == 0) {
            return false; // let them enter nothing, will default to 0 onblur
        }

        newVal = parseInt(newVal, 10);

        if (_.isNaN(newVal)) {
            this.$amount.val(this.$slider.slider('value'));
            return false;
        }

        newVal = Math.max(DATA.sliderConfig.min, newVal);
        newVal = Math.min(DATA.sliderConfig.max, newVal);

        this.$amount.val(newVal);
        this.$slider.slider('value', newVal);
    },

    refreshAmount: function(model, value)
    {
        if (!(value >= DATA.sliderConfig.min && value <= DATA.sliderConfig.max)) {
            value = 0;
        }
        this.$amount.val(value);
    },

    placeFederalAllocation: function()
    {
        var federalAllocation = this.category.federalAllocation;
        var $federalAllocation = this.$('.federal-allocation');
        var maxAmount = DATA.sliderConfig.max;
        var sliderWidth = this.$slider.width();
        var federalAllocationOffsetPercentage = federalAllocation / maxAmount;
        var sliderControlWidth = this.$slider.find('a').width();

        $federalAllocation.css('left', sliderWidth * federalAllocationOffsetPercentage - $federalAllocation.width() / 2 + sliderControlWidth / 2 - 1);
    },

    render: function()
    {
        this.$('.info-icon').tooltip({ title: this.category.tooltip, placement: "right" });
        this.$slider.slider('value', this.model.get(this.options.category));
        this.refreshAmount(null, this.$slider.slider('value'));
        this.placeFederalAllocation();
    }

});