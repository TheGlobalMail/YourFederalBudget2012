TGM.Views.OtherBudgetsPane = TGM.Views.SidePane.extend({

    events: {
        "mousewheel .other-budgets": "onScroll"
    },

    initialize: function()
    {
        _.bindAll(this);

        this.userBudget = new TGM.Views.OtherBudget({ model: this.model, editable: true });
        this.otherBudgetViews = [];
        this.collection.on('fetchMore', this.showMoreBudgets);
        this.collection.fetchMore();

        this.$('.your-budget').html(this.userBudget.$el);
        this.$otherBudgets = this.$('.other-budgets');
        this.$inner = this.$('.other-budgets-inner');
    },

    showMoreBudgets: function(collection, response)
    {
        var budgets = collection.getLastFetched();

        _.each(budgets, function(budget) {
            if (budget.get('_id') == this.model.get('_id')) {
                return false; // don't show user budget in this list
            }

            var view = new TGM.Views.OtherBudget({ model: budget });
            this.$inner.append(view.render().$el);

            this.otherBudgetViews.push(view);
        }, this);
    },

    onScroll: function(e, delta, deltaX)
    {
        var atBottom = this.$otherBudgets.scrollTop() + this.$otherBudgets.outerHeight() > this.$inner.outerHeight(true);
        console.log('atBottom', atBottom);
    }

});