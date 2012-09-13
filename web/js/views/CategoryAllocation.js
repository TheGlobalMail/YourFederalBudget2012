TGM.Views.CategoryAllocation = Backbone.View.extend({

    events: {
        "slide .slider-control": "onSlide",
        "slidestop .slider-control": "onSlide",
        "click": "expand"
    },

    animationSpeed: 500,

    initialize: function(options)
    {
        _.bindAll(this);

        this.$slider       = this.$('.slider-control').slider(DATA.sliderConfig);
        this.$sliderHandle = this.$('.ui-slider-handle');
        this.$expander     = this.$('.expander');

        this.model.on("change:" + options.category, this.refreshAmount);

        this.category = DATA.categories[options.category];

        this.$sliderHandle.tooltip({ title: DATA.messages.budgetFullyAllocated, placement: 'right', trigger: 'manual' });
        this.$('.info-icon').popover({ content: this.category.tooltip, placement: 'right' });
        this.$slider.slider('value', this.model.get(this.options.category));

        this.refreshAmount(null, this.$slider.slider('value'));
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

    refreshAmount: function(model, value)
    {
        if (value < DATA.sliderConfig.min && value > DATA.sliderConfig.max) {
            value = 0;
        }

        this.$slider.slider('value', value);
    },

    expand: function(options)
    {
        var defaults = {
            force: false,
            doAnimation: true
        }

        _.defaults(options, defaults);

        if (this.isExpanded() && !options.force) {
            return false;
        }

        if (options.doAnimation) {
            this.$expander.slideDown({ speed: this.animationSpeed });
        }

        TGM.vent.trigger('BudgetAllocatorCategory:expanding', this.options.category);
        this.$el.addClass('visible');
    },

    collapse: function()
    {
        this.$expander.slideUp({ speed: this.animationSpeed });
        this.$el.removeClass('visible');
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