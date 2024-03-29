TGM.Views.OtherBudgetsPane = TGM.Views.SidePane.extend({

    events: {
        "click .your-budget": "triggerEdit"
    },

    initialize: function()
    {
        this._onScroll = _.throttle(this.onScroll, 100);
        this._initScroll = _.once(this.initScroll);
        _.bindAll(this);

        this.$yourBudget   = this.$('.your-budget');
        this.$otherBudgets = this.$('.other-budgets');
        this.$inner        = this.$('.other-budgets-inner');
        this.$loadingState = this.$('.loading-more');

        TGM.vent.on('introClosed', this.enableContent);

        this.userBudget = new TGM.Views.OtherBudget({ model: this.model, editable: true });
        this._renderedModels = {};

        this.model.on('sync', this.showUserBudget);

        this.collection.on('fetching', this.fetchingMore);
        this.collection.on('add', this.showMoreBudgets);
        this.collection.on('full', this.noMoreBudgets);
        this.collection.on('remove', this.removeBudgets);
        this.collection.fetchMore();
    },

    initScroll: function()
    {
        if (TGM.has.touch) {
            this.$otherBudgets.on('scroll', this._onScroll);
        } else {
            this.$otherBudgets.on('scroll mousewheel', this._onScroll);
        }
    },

    removeBudgets: function(model)
    {
        if (model.id in this._renderedModels) {
            this._renderedModels[model.id].close();
        }
    },

    showMoreBudgets: function(collection, response)
    {
        var budgets = this.collection.filter(function(model) {
            return !_.include(_.keys(this._renderedModels), model.id);
        }, this);

        _.each(budgets, function(budget) {
            if (budget.id == this.model.id || !budget.id) {
                return false; // don't show user budget in this list (or has no id??)
            }

            var view = new TGM.Views.OtherBudget({ model: budget });
            this.$inner.append(view.render().$el);
            view.doColorBar();

            this._renderedModels[budget.id] = view;
        }, this);

        this._initScroll();

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
            // TODO we should never get to this tree, can this be removed?
            window.appRouter.goto("");
        } else {
            window.appRouter.goto("budget", this.model.id);
        }
    },

    enableContent: function()
    {
        this.$otherBudgets.css('overflow-y', 'scroll');
    }

});