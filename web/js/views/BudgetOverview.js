TGM.Views.BudgetOverview = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this, 'closeTooltip');
        this.$total = this.$("#budget-total");
        this.$progress = this.$('.bar');
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
        this.$total.text((DATA.budgetAllowance - this.model.getTotal()).toFixed(1));
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    budgetFullyAllocated: function(yes)
    {
        if (yes) {
            this.showTooltip(DATA.messages.budgetFullyAllocated);
        } else {
            this.closeTooltip();
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
    }

});