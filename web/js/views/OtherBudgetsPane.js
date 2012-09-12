TGM.Views.OtherBudgetsPane = TGM.Views.SidePane.extend({

    events: {
        "mousewheel .other-budgets": "_onScroll"
    },

    initialize: function()
    {
        this._onScroll = _.throttle(this.onScroll, 100);
        _.bindAll(this);

        this.userBudget = new TGM.Views.OtherBudget({ model: this.model, editable: true });
        this.otherBudgetViews = [];

        this.$('.your-budget').html(this.userBudget.$el);
        this.$otherBudgets = this.$('.other-budgets');
        this.$inner = this.$('.other-budgets-inner');
        this.$loadingState = this.$('.loading-more');

        this.collection.on('fetching', this.fetchingMore);
        this.collection.on('fetched', this.showMoreBudgets);
        this.collection.on('full', this.noMoreBudgets);
        this.collection.fetchMore();
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

        this.$loadingState.removeClass('loading').text(DATA.messages.otherBudgets.fetched);
    },

    onScroll: function(e, delta, deltaX)
    {
        var atBottom = this.$otherBudgets.scrollTop() + this.$otherBudgets.outerHeight() > this.$inner.outerHeight(true);

        if (atBottom) {
            this.collection.fetchMore();
        }
    },

    fetchingMore: function()
    {
        this.$loadingState.addClass('loading').text(DATA.messages.otherBudgets.fetching)
    },

    noMoreBudgets: function()
    {
        this.$loadingState.removeClass('loading').addClass('full').text(DATA.messages.otherBudgets.full);
    }

});