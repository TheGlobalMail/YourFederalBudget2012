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
        this.$sliderAmount = this.$('.slider-amount');

        this.category = DATA.categories[options.category];

        this.$sliderHandle.tooltip({ title: DATA.messages.budgetFullyAllocated, placement: 'right', trigger: 'manual' });
        this.$slider.slider('value', this.model.get(this.options.category));

        TGM.vent.on('budgetModeChange', this.budgetModeChanged);
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.expand);

        this.model.on("pretaxIncomeChange change:" + options.category, this.refreshAmount);
        this.refreshAmount(this.model);
    },

    onSlide: function(e, ui)
    {
        if (!this.$el.hasClass('active')) {
            this.expand();
        }

        this.model.set(this.options.category, ui.value);

        if (ui.value != this.model.get(this.options.category)) {
            return false;
        }

        this.refreshAmount();
        this.model.cache();
    },

    refreshAmount: function(model)
    {
        model = model || this.model;
        var value = model.get(this.options.category);

        if (value < DATA.sliderConfig.min && value > DATA.sliderConfig.max) {
            value = 0;
        }

        this.$slider.slider('value', value);

        if (this.currentBudgetMode == 'your-pretax-income') {
            value = model.getIncomeBasedAmount(this.options.category);
            var amount = accounting.formatMoney(value, '$', 2);
        } else {
            var amount = accounting.formatMoney(value, '$', 1) + "b";
        }

        this.$sliderAmount.text(amount);
    },

    expand: function(category)
    {
        if (_.isString(category) && category != this.options.category) {
            return false;
        } else if (!_.isString(category)) {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', this.options.category);
        }

        this.$el.addClass('active');
    },

    collapse: function()
    {
        this.$el.removeClass('active');
    },

    budgetModeChanged: function(newBudgetMode)
    {
        this.currentBudgetMode = newBudgetMode;
        this.refreshAmount(this.model);
    }

});