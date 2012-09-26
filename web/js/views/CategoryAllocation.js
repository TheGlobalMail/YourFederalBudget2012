TGM.Views.CategoryAllocation = Backbone.View.extend({

    events: {
        "slide .slider-control": "onSlide",
        "slidestop .slider-control": "onSlide",
        "click": "expand"
    },

    amountHTML: '<div class="ui-slider-amount"><div class="arrow"></div><div class="slider-amount"></div></div>',

    animationSpeed: 500,

    initialize: function(options)
    {
        _.bindAll(this);

        this.$slider       = this.$('.slider-control').slider(DATA.sliderConfig);
        this.$sliderHandle = this.$('.ui-slider-handle');
        this.$sliderHandle.append(this.amountHTML);
        this.$sliderAmount = this.$sliderHandle.find('.slider-amount');

        this.model.on("pretaxIncomeChange change:" + options.category, this.refreshAmount);

        this.category = DATA.categories[options.category];

        this.$sliderHandle.tooltip({ title: DATA.messages.budgetFullyAllocated, placement: 'right', trigger: 'manual' });
        this.$('.info-icon').popover({ content: this.category.tooltip, placement: 'right', trigger: 'click' });
        this.$slider.slider('value', this.model.get(this.options.category));
        TGM.vent.on('baseCalculation', this.toggleActivated);
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

        this.refreshAmount(this.model, this.model.get(this.options.category));
        this.model.tryCaching();
    },

    refreshAmount: function(model)
    {
        var value = model.get(this.options.category);
        if (value < DATA.sliderConfig.min && value > DATA.sliderConfig.max) {
            value = 0;
        }

        this.$slider.slider('value', value);

        if (this.activeToggleName == 'your-pretax-income') {
            value = model.getIncomeBasedAmount(this.options.category);
            var precision = (value >= 10000) ? 0 : 2;
            var amount = accounting.formatMoney(value, '$', precision);
        } else {
            var amount = accounting.formatMoney(value, '$', 1) + "b";
        }

        this.$sliderAmount.text(amount);
    },

    expand: function()
    {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', this.options.category);
        this.$el.addClass('active');
        this.$sliderAmount.parent().show();
    },

    collapse: function()
    {
        this.$el.removeClass('active');
        this.$sliderAmount.parent().hide();
    },

    toggleActivated: function(name)
    {
        this.activeToggleName = name;
    }

});