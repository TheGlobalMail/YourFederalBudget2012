TGM.Routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                 "index",
        "budget/:id":       "loadBudget",
        "budgets/save":     "saveBudget",
        "budget/:id/save":  "saveBudget",
        "budgets":          "viewBudgets"
    },

    views: {},
    models: {},

    initialize: function()
    {
        _.bindAll(this);

        this.views.application = new TGM.Views.Application({ el: $('body') });
        this.views.barGraph = new TGM.Views.BarGraph({ el: $("#visualisation") });
        this.views.moreInfo = new TGM.Views.MoreInfo({ el: $("#more-info") });

        _.each(DATA.categories, function(value, id) {
            TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
            this.views.barGraph.addCategory(id, value);
        }, this);

        this.models.userBudget = new TGM.Models.Budget();
        this.models.federalBudget = new TGM.Models.Budget();

        this.views.barGraph.model = this.models.userBudget;
        this.views.barGraph.addBudget("user", this.models.userBudget);
        this.views.barGraph.addBudget("federal", this.models.federalBudget);
        this.views.barGraph.render();

        this.views.emailPage = new TGM.Views.EmailPage({ el: $("#email-page-form") });

        this.views.sidePaneManager = new TGM.Views.SidePaneManager({ el: $("#left-column")});
        this.views.sidePaneManager.addSidePanes({
            "budget-allocator":     new TGM.Views.BudgetAllocatorPane({ el: $("#budget-allocator"), model: this.models.userBudget }),
            "save-budget":          new TGM.Views.SaveBudgetPane({ el: $("#save-budget-pane"), model: this.models.userBudget }),
            "share-budget":         new TGM.Views.ShareBudgetPane({ el: $("#share-budget-pane"), model: this.models.userBudget }),
            "other-budgets":        new TGM.Views.OtherBudgetsPane({ el: $("#other-budgets-pane"), model: this.models.userBudget })
        });
    },

    index: function()
    {
        var budgetId = $.jStorage.get('budgetId');

        if (budgetId) {
            this.navigate("budget/" + budgetId, { trigger: true });
        } else {
            TGM.vent.trigger('showSidePane', 'budget-allocator');
        }
    },

    loadBudget: function(id)
    {
        this.models.userBudget.set('_id', id);

        var fetchError = _.bind(function(model, response) {
            if (response.status == 404) {
                this.navigate("", { trigger: true });
            }
        }, this);

        var success = _.bind(function() {
            TGM.vent.trigger('showSidePane', 'budget-allocator');
        }, this);

        this.models.userBudget.fetch({ success: success, error: fetchError });
    },

    saveBudget: function(id)
    {
        if (!id) {
            TGM.vent.trigger('showSidePane', 'save-budget');
            return true;
        }

        var success = _.bind(function() {
            TGM.vent.trigger('showSidePane', 'share-budget');
        }, this);

        this.models.userBudget.set('_id', id);

        var fetchError = _.bind(function(model, response) {
            if (response.status == 404) {
                this.navigate("", { trigger: true });
            }
        }, this);

        this.models.userBudget.fetch({ success: success, error: fetchError });
    },

    viewBudgets: function()
    {
        TGM.vent.trigger('showSidePane', 'other-budgets');
    }

});