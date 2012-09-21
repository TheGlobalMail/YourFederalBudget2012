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

        this.model.on("change:" + options.category, this.refreshAmount);

        this.category = DATA.categories[options.category];

        this.$sliderHandle.tooltip({ title: DATA.messages.budgetFullyAllocated, placement: 'right', trigger: 'manual' });
        this.$('.info-icon').popover({ content: this.category.tooltip, placement: 'right', trigger: 'click' });
        this.$slider.slider('value', this.model.get(this.options.category));
    },

    onSlide: function(e, ui)
    {
        this.expand();


        this.model.set(this.options.category, ui.value);

        if (ui.value != this.model.get(this.options.category)) {

            return false;
        }

        this.$slider.slider('value', this.model.get(this.options.category));
        this.model.tryCaching();
    },

    refreshAmount: function(model, value)
    {
        if (value < DATA.sliderConfig.min && value > DATA.sliderConfig.max) {
            value = 0;
        }

        this.$slider.slider('value', value);
    },

    expand: function()
    {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', this.options.category);
        this.$el.addClass('active');
    },

    collapse: function()
    {
        this.$el.removeClass('active');
    }

});