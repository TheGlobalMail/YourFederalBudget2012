TGM.Views.BudgetModeToggler = Backbone.View.extend({

    events: {
        'click .toggle .side': 'activateBudgetMode',
        'click .toggle .side.your-pretax-income': 'onYourPreTaxIncomeClick',
        'keyup .your-pretax-income input': 'recalculateIncomeBasedAmounts',
        'blur .your-pretax-income input': 'onPretaxIncomeBlur',
        'focus .your-pretax-income input': 'onPretaxIncomeFocus'
    },

    defaultPretaxIncome: '50000',

    initialize: function()
    {
        this.recalculateIncomeBasedAmounts = _.debounce(this.recalculateIncomeBasedAmounts, 250);
        _.bindAll(this);

        this.$pretaxIncome = this.$('.your-pretax-income input');
        this.$currentBudgetMode = this.$('.side.active');
        this.currentBudgetMode = this.$currentBudgetMode.data('name');

        this.incomePrivacyTooltip = new $.fn.tooltip.Constructor(this.$('.side.your-pretax-income')[0], {
            trigger: 'manual',
            placement: 'right'
        });

        this.lowIncomeTooltip = new $.fn.tooltip.Constructor(this.$('.side.your-pretax-income')[0], {
            trigger: 'manual',
            placement: 'right'
        });
        this.lowIncomeTooltip.tip().addClass('error');

        TGM.vent.trigger('baseCalculation', this.$currentBudgetMode.data('name'));
    },

    showIncomePrivacyTooltip: function()
    {
        var onClose = _.bind(function() {
            // prevent focus from display the tooltip again
            this.pretaxIncomeFocusedThenBlurred = false;
            this.$pretaxIncome.focus();
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
            return false;
        }, this));
    },

    _closeTooltip: function(tooltip)
    {
        tooltip.hide();
    },

    closeTooltips: function()
    {
        _.each([this.lowIncomeTooltip, this.incomePrivacyTooltip], this._closeTooltip, this);
    },

    activateBudgetMode: function(e)
    {
        var $newBudgetMode = $(e.currentTarget);
        var newBudgetMode = $newBudgetMode.data('name');
        this.pretaxIncomeFocusedThenBlurred = false;

        if (newBudgetMode && newBudgetMode != this.currentBudgetMode) {
            // swap the active class
            this.$currentBudgetMode.removeClass('active');
            $newBudgetMode.addClass('active');

            this.$currentBudgetMode = $newBudgetMode;
            this.currentBudgetMode = newBudgetMode;
            TGM.vent.trigger('budgetModeChange', newBudgetMode);

            if (newBudgetMode == 'your-pretax-income' && this.shouldShowIncomePrivacyTooltip()) {
                this.showIncomePrivacyTooltip();
                this.recalculateIncomeBasedAmounts();
            } else if (newBudgetMode == 'federal-spending') {
                this.closeTooltips();
                this.$pretaxIncome.blur();
            }
        }
    },

    recalculateIncomeBasedAmounts: function(e)
    {
        var pretaxIncome = parseInt(this.$pretaxIncome.val(), 10);
        pretaxIncome = Math.min(pretaxIncome, 10000000);

        if (!pretaxIncome || pretaxIncome < 18200) {
            if (this.incomePrivacyTooltip.tip().is(':hidden') && this.lowIncomeTooltip.tip().is(':hidden')) {
                // don't show if we're showing the one about income privacy or already showing
                this._showTooltip(this.lowIncomeTooltip, DATA.messages.lowIncome);
            }

            pretaxIncome = 0;
        } else if (this.lowIncomeTooltip.tip().is(":visible")) {
            this._closeTooltip(this.lowIncomeTooltip);
        }

        if (e && e.type == "keyup") {
            _.delay(this._closeTooltip, 1200, this.incomePrivacyTooltip);
            _.delay(this.recalculateIncomeBasedAmounts, 1250);
        }

        this.model.calculatePretaxIncomeAmounts(pretaxIncome);
        this.model.trigger('change pretaxIncomeChange', this.model);
    },

    onYourPreTaxIncomeClick: function()
    {
        this.$pretaxIncome.focus();
    },

    onPretaxIncomeBlur: function()
    {
        this.closeTooltips();
        this.pretaxIncomeFocusedThenBlurred = true;
    },

    onPretaxIncomeFocus: function()
    {
        if (this.pretaxIncomeFocusedThenBlurred && this.shouldShowIncomePrivacyTooltip()) {
            this.showIncomePrivacyTooltip();
            this.pretaxIncomeFocusedThenBlurred = false;
        }
    },

    shouldShowIncomePrivacyTooltip: function()
    {
        return this.$pretaxIncome.val() == this.defaultPretaxIncome || !this.$pretaxIncome.val();
    }

});