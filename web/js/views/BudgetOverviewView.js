TGM.Views.BudgetOverviewView = Backbone.View.extend({

    el: $("#budget-overview"),

    events: {
        "click #reset": "resetBudget"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.$total = $("#budget-total");
        this.$progress = this.$('.bar');
        this.updateTotal();
        this.model.on("change", _.debounce(this.updateTotal, 100));
    },

    updateTotal: function()
    {
        this.$total.text(this.model.getTotal());
        this.$progress.css('width', (this.model.getTotal() / DATA.budgetAllowance * 100) + "%");
    },

    resetBudget: function()
    {
        this.model.resetBudget();
    }

});