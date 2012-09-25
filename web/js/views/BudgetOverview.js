TGM.Views.BudgetOverview = Backbone.View.extend({

    events: {
        'click .toggle .side': 'activateToggle',
        'keyup .your-pretax-income input': 'recalculateIncomeBasedAmounts'
    },

    initialize: function()
    {
        this.recalculateIncomeBasedAmounts = _.debounce(this.recalculateIncomeBasedAmounts, 250);
        _.bindAll(this, 'closeTooltip', 'activateToggle', 'recalculateIncomeBasedAmounts');

        this.$total        = this.$("#budget-total");
        this.$progress     = this.$('.bar');
        this.$currentSide  = this.$('.toggle .side.active');
        this.$preTaxIncome = this.$('.your-pretax-income input');

        this.updateTotal();

        this.model.on("change", _.throttle(this.updateTotal, 80), this);
        TGM.vent.on('budgetFullyAllocated', this.budgetFullyAllocated, this);

        this.tooltip = new $.fn.tooltip.Constructor(this.$('.progress-bar')[0], {
            trigger: 'manual',
            placement: 'right'
        });
    },

    updateTotal: function()
    {
        if (this.$currentSide.data('name') == 'federal-spending') {
            this.$total.text((DATA.budgetAllowance - this.model.getTotal()).toFixed(1) + "b");
        } else if (this.$currentSide.data('name') == 'your-pretax-income') {
            this.$total.text(Math.round(this.model.taxPaid - this.model.getIncomeBasedTotal()));
        }

        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    budgetFullyAllocated: function(yes)
    {
        if (yes) {
            this.showTooltip(DATA.messages.budgetFullyAllocated);
            this.$('.progress-bar').addClass('budget-fully-allocated');
        } else {
            this.closeTooltip();
            this.$('.progress-bar').removeClass('budget-fully-allocated');
        }
    },

    showTooltip: function(message)
    {
        var $close = $('<a href="#" class="close">&times;</a>');
        var $message = $('<span/>').text(message).append($close);

        this.tooltip.options.title = $message;
        this.tooltip.show();

        $close.on('click', _.bind(function(e) {
            e.preventDefault();
            this.closeTooltip();
        }, this));
    },

    closeTooltip: function()
    {
        this.tooltip.hide();
    },

    activateToggle: function(e)
    {
        var side = $(e.currentTarget);

        if (!side.hasClass('active')) {
            this.$currentSide.removeClass('active');
            side.addClass('active');
            this.$currentSide = side;
            TGM.vent.trigger('baseCalculation', side.data('name'));
            this.recalculateIncomeBasedAmounts();
        }
    },

    recalculateIncomeBasedAmounts: function()
    {
        var pretaxIncome = parseInt(this.$preTaxIncome.val(), 10);
        pretaxIncome = Math.min(pretaxIncome, 10000000);

        if (!pretaxIncome || pretaxIncome < 1000) {
            return false;
        }

        this.model.calculatePretaxIncomeAmounts(pretaxIncome);
        this.model.trigger('change');
    }

});