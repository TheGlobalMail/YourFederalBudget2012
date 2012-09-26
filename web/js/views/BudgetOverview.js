TGM.Views.BudgetOverview = Backbone.View.extend({

    initialize: function()
    {
        this.$total    = this.$("#budget-total");
        this.$progress = this.$('.bar');

        this.updateTotal();

        TGM.vent.on('budgetModeChange', this.budgetModeChanged, this);
        this.model.on("change", _.throttle(this.updateTotal, 80), this);
        TGM.vent.on('budgetFullyAllocated', this.budgetFullyAllocated, this);

        this.budgetFullyAllocatedTooltip = new $.fn.tooltip.Constructor(this.$('.progress-bar')[0], {
            trigger: 'manual',
            placement: 'right'
        });

        this.budgetFullyAllocatedTooltip.tip().addClass('error');
    },

    updateTotal: function()
    {
        var remaining = "$0";

        if (this.currentBudgetMode == 'your-pretax-income') {
            var remaining = this.model.taxPaid - this.model.getIncomeBasedTotal();
            remaining = accounting.formatMoney(remaining, "$", 2);
        } else {
            var remaining = DATA.budgetAllowance - this.model.getTotal();
            remaining = accounting.formatMoney(remaining, "$", 1) + "b";
        }

        this.$total.text(remaining);
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    budgetFullyAllocated: function(yes)
    {
        if (yes) {
            this.$('.progress-bar').addClass('budget-fully-allocated');
            this.showBudgetFullyAllocatedTooltip();
        } else {
            this.$('.progress-bar').removeClass('budget-fully-allocated');
            this.closeBudgetFullyAllocatedTooltip();
        }
    },

    showBudgetFullyAllocatedTooltip: function()
    {
        var $close = $('<a href="#" class="close">&times;</a>');
        var $message = $('<span/>').text(DATA.messages.budgetFullyAllocated).append($close);

        this.budgetFullyAllocatedTooltip.options.title = $message;
        this.budgetFullyAllocatedTooltip.show();

        $close.on('click', _.bind(function(e) {
            e.preventDefault();
            this.closeBudgetFullyAllocatedTooltip();
        }, this));
    },

    closeBudgetFullyAllocatedTooltip: function()
    {
        this.budgetFullyAllocatedTooltip.hide();
    },

    budgetModeChanged: function(newBudgetMode)
    {
        this.currentBudgetMode = newBudgetMode;
        this.updateTotal();
    }

});