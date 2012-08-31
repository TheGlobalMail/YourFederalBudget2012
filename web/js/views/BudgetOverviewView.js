TGM.Views.BudgetOverviewView = Backbone.View.extend({

    el: $("#budget-overview"),

    initialize: function()
    {
        _.bindAll(this);
        this.$total = this.$("#budget-total");
        this.$progress = this.$('.bar');
        this.updateTotal();
        this.model.on("change", _.throttle(this.updateTotal, 80));
    },

    updateTotal: function()
    {
        this.$total.text(this.model.getTotal());
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    }

});