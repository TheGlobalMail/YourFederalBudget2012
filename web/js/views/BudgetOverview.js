TGM.Views.BudgetOverview = Backbone.View.extend({

    initialize: function()
    {
        this.$remaining = this.$(".budget-remaining");
        this.$progress  = this.$('.bar');
        this.$progressBar = this.$('.progress-bar');
        this.$budgetAllowance = this.$('.budget-allowance');

        this.updateTotal();

        TGM.vent.on('budgetModeChange', this.budgetModeChanged, this);
        this.model.on("change", _.throttle(this.updateTotal, 80), this);
        TGM.vent.on('budgetFullyAllocated', this.budgetFullyAllocated, this);

        this.budgetFullyAllocatedTooltip = new $.fn.tooltip.Constructor(this.$progressBar[0], {
            trigger: 'manual',
            placement: 'right'
        });

        this.budgetFullyAllocatedTooltip.tip().addClass('error');
        this.updateTotal();
    },

    updateTotal: function()
    {
        if (this.currentBudgetMode == 'your-pretax-income') {
            var remaining = this.model.taxPaid - this.model.getIncomeBasedTotal();
            remaining = Math.max(remaining, 0);
            remaining = accounting.formatMoney(remaining, "$", 2);

            var allowance = accounting.formatMoney(this.model.taxPaid, '$', 2);
        } else {
            var remaining = DATA.budgetAllowance - this.model.getTotal();
            remaining = Math.max(remaining, 0);
            remaining = accounting.formatMoney(remaining, "$", 1) + "b";

            var allowance = accounting.formatMoney(DATA.budgetAllowance, '$', 1) + 'b';
        }

        this.$remaining.text(remaining);
        this.$budgetAllowance.text(allowance);
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    budgetFullyAllocated: function(yes)
    {
        if (yes) {
            this.$progressBar.addClass('budget-fully-allocated');
            this.showBudgetFullyAllocatedTooltip();
        } else {
            this.$progressBar.removeClass('budget-fully-allocated');
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