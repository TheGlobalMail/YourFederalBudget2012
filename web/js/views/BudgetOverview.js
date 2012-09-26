TGM.Views.BudgetOverview = Backbone.View.extend({

    events: {
        'click .toggle .side': 'activateToggle',
        'click .toggle .side.your-pretax-income': 'onYourPreTaxIncomeClick',
        'keyup .your-pretax-income input': 'recalculateIncomeBasedAmounts',
        'blur .your-pretax-income input': 'onPreTaxIncomeBlur'
    },

    initialize: function()
    {
        this.recalculateIncomeBasedAmounts = _.debounce(this.recalculateIncomeBasedAmounts, 250);
        _.bindAll(this);

        this.$total        = this.$("#budget-total");
        this.$progress     = this.$('.bar');
        this.$currentSide  = this.$('.toggle .side.active');
        this.$preTaxIncome = this.$('.your-pretax-income input');

        this.updateTotal();

        this.model.on("change", _.throttle(this.updateTotal, 80), this);
        TGM.vent.on('budgetFullyAllocated', this.budgetFullyAllocated, this);

        this.budgetFullyAllocatedTooltip = new $.fn.tooltip.Constructor(this.$('.progress-bar')[0], {
            trigger: 'manual',
            placement: 'right'
        });
        this.budgetFullyAllocatedTooltip.tip().addClass('error');

        this.incomePrivacyTooltip = new $.fn.tooltip.Constructor(this.$('.side.your-pretax-income')[0], {
            trigger: 'manual',
            placement: 'right'
        });

        this.hasEnteredIncome = false;
        TGM.vent.trigger('baseCalculation', this.$currentSide.data('name'));
    },

    updateTotal: function()
    {
        var remaining = "$0";

        if (this.$currentSide.data('name') == 'federal-spending') {
            var remaining = DATA.budgetAllowance - this.model.getTotal();
            remaining = accounting.formatMoney(remaining, "$", 1) + "b";
        } else if (this.$currentSide.data('name') == 'your-pretax-income') {
            var remaining = this.model.taxPaid - this.model.getIncomeBasedTotal();
            remaining = accounting.formatMoney(remaining, "$", 2);
        }

        this.$total.text(remaining);
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    budgetFullyAllocated: function(yes)
    {
        if (yes) {
            this.$('.progress-bar').addClass('budget-fully-allocated');
            this.showBudgetFullyAllocatedTooltip(DATA.messages.budgetFullyAllocated);
        } else {
            this.$('.progress-bar').removeClass('budget-fully-allocated');
            this.closeBudgetFullyAllocatedTooltip();
        }
    },

    showBudgetFullyAllocatedTooltip: function(message)
    {
        this._showTooltip(this.budgetFullyAllocatedTooltip, message);
    },

    closeBudgetFullyAllocatedTooltip: function()
    {
        this._closeTooltip(this.budgetFullyAllocatedTooltip);
    },

    showIncomePrivacyTooltip: function()
    {
        var onClose = _.bind(function() {
            this.hasEnteredIncome = true;
            this.$preTaxIncome.focus();
        }, this);

        this._showTooltip(this.incomePrivacyTooltip, DATA.messages.incomePrivacy, onClose);
    },

    closeIncomePrivacyTooltip: function()
    {
        this.incomePrivacyTooltip.tip().find('.close').click();
    },

    _showTooltip: function(tooltip, message, onClose)
    {
        var $close = $('<a href="#" class="close">&times;</a>');
        var $message = $('<span/>').text(message).append($close);
        onClose = onClose || function() {};

        tooltip.options.title = $message;
        tooltip.show();

        $close.on('click', _.bind(function(e) {
            e.preventDefault();
            this._closeTooltip(tooltip);
            onClose(tooltip);
        }, this));
    },

    _closeTooltip: function(tooltip)
    {
        tooltip.hide();
    },

    closeTooltips: function()
    {
        _.each([this.budgetFullyAllocatedTooltip, this.incomePrivacyTooltip], this._closeTooltip, this);
    },

    activateToggle: function(e)
    {
        var $side = $(e.currentTarget);

        if (!$side.hasClass('active')) {
            this.$currentSide.removeClass('active');
            $side.addClass('active');
            this.$currentSide = $side;
            TGM.vent.trigger('baseCalculation', $side.data('name'));

            if ($side.data('name') == 'your-pretax-income' && !this.$preTaxIncome.val()) {
                this.showIncomePrivacyTooltip();
            } else if ($side.data('name') == 'federal-spending') {
                this.closeIncomePrivacyTooltip();
                this.$preTaxIncome.blur();
            }

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

        _.delay(this._closeTooltip, 1200, this.incomePrivacyTooltip)

        this.model.calculatePretaxIncomeAmounts(pretaxIncome);
        this.model.trigger('change pretaxIncomeChange', this.model);
    },

    onYourPreTaxIncomeClick: function()
    {
        this.$preTaxIncome.focus();
    },

    onPreTaxIncomeBlur: function()
    {
        if (this.$preTaxIncome.val()) {
            this.closeIncomePrivacyTooltip();
        }
    }

});