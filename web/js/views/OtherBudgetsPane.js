TGM.Views.OtherBudgetsPane = TGM.Views.SidePane.extend({

    events: {
        "mousewheel .other-budgets": "_onScroll",
        "click .your-budget": "triggerEdit"
    },

    initialize: function()
    {
        this._onScroll = _.throttle(this.onScroll, 100);
        _.bindAll(this);

        this.userBudget = new TGM.Views.OtherBudget({ model: this.model, editable: true });
        this.otherBudgetViews = [];

        this.$yourBudget = this.$('.your-budget');
        this.$otherBudgets = this.$('.other-budgets');
        this.$inner = this.$('.other-budgets-inner');
        this.$loadingState = this.$('.loading-more');

        this.model.on('sync', this.showUserBudget);

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
            view.doColorBar();

            this.otherBudgetViews.push(view);
        }, this);

        this.$loadingState.removeClass('loading').text(DATA.messages.otherBudgets.fetched);
    },

    onScroll: function()
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
    },

    showUserBudget: function()
    {
        this.$yourBudget.html(this.userBudget.render().$el);
        this.userBudget.doColorBar();
    },

    triggerEdit: function()
    {
        if (this.model.isNew()) {
            window.appRouter.goto("");
        } else {
            window.appRouter.goto("budget", this.model.id);
        }
    }

});