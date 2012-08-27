TGM.Views.CategoryAllocationView = Backbone.View.extend({

    events: {
        "slide .slider-control": "onSlide",
        "slidestop .slider-control": "onSlide",
        "keyup .amount": "onManualEntry",
        "click": "expand"
    },

    animationSpeed: 500,

    initialize: function(options)
    {
        _.bindAll(this);

        this.$slider       = this.$('.slider-control').slider(DATA.sliderConfig);
        this.$sliderHandle = this.$('.ui-slider-handle');
        this.$amount       = this.$('.amount');
        this.$expander     = this.$('.expander');

        this.model.on("change:" + options.category, this.refreshAmount);

        this.category = DATA.categories[options.category];

        this.$sliderHandle.tooltip({ title: DATA.messages.budgetFullyAllocated, placement: 'right', trigger: 'manual' });
        this.$('.info-icon').popover({ content: this.category.tooltip, placement: 'right' });
        this.$slider.slider('value', this.model.get(this.options.category));

        this.refreshAmount(null, this.$slider.slider('value'));
        this.placeFederalAllocation();
    },

    onSlide: function(e, ui)
    {
        // do we need to hide the tooltip?
        if (this.budgetFullyAllocatedTooltipOpen) {
            // cahce function to hide tooltip
            var hideTooltip = _.bind(function() {
                this.$sliderHandle.tooltip('hide');
                this.budgetFullyAllocatedTooltipOpen = false;
            }, this);

            if (+new Date - this.budgetFullyAllocatedTooltipOpen > 3000 || ui.value < this.model.get(this.options.category)) {
                hideTooltip(); // it's been open longer than 3s, lets hide OR moving slider down
            } else {
                // hasn't been up for long, delay hiding it
                setTimeout(hideTooltip, 3000 - (+new Date - this.budgetFullyAllocatedTooltipOpen));
            }
        }

        this.model.set(this.options.category, ui.value);

        if (ui.value != this.model.get(this.options.category)) {
            if (!this.budgetFullyAllocatedTooltipOpen) {
                this.$sliderHandle.tooltip('show');
                this.budgetFullyAllocatedTooltipOpen = +new Date;
            }
            return false;
        }

        this.$slider.slider('value', this.model.get(this.options.category));
    },

    onManualEntry: function()
    {
        var newVal = this.$amount.val();

        if (newVal.length == 0) {
            return false; // let them enter nothing, will default to 0 onblur
        }

        this.model.set(this.options.category, newVal);
        this.$amount.val(this.model.get(this.options.category));
    },

    refreshAmount: function(model, value)
    {
        if (value < DATA.sliderConfig.min && value > DATA.sliderConfig.max) {
            value = 0;
        }

        if (this.$amount.val() != value) {
            this.$amount.val(value);
        }

        this.$slider.slider('value', value);
    },

    placeFederalAllocation: function()
    {
        var federalAllocation = this.category.federalAllocation;
        var $federalAllocation = this.$('.federal-allocation');
        var sliderWidth = this.$slider.width();
        var federalAllocationPercentage = federalAllocation / DATA.sliderConfig.max;
        var sliderControlWidth = this.$sliderHandle.width();

        $federalAllocation.css('left', sliderWidth * federalAllocationPercentage - $federalAllocation.width() / 2 + sliderControlWidth / 2 - 1);
    },

    expand: function()
    {
        if (this.isExpanded()) {
            return false;
        }

        TGM.vent.trigger('BudgetAllocatorCategory:expanding', this.options.category);
        this.$expander.slideDown({ speed: this.animationSpeed });
    },

    collapse: function()
    {
        this.$expander.slideUp({ speed: this.animationSpeed });
    },

    hide: function()
    {
        this.$expander.hide();
    },

    isExpanded: function()
    {
        return this.$expander.is(":visible");
    }

});