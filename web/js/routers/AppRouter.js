TGM.Routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                 "index",
        "budget/:id":       "loadBudget"
    },

    views: {},
    models: {},

    initialize: function()
    {
        _.bindAll(this);

        this.views.barGraph = new TGM.Views.BarGraph({ el: $("#visualisation") });
        this.views.moreInfo = new TGM.Views.MoreInfo({ el: $("#more-info") });

        _.each(DATA.categories, function(value, id) {
            TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
            this.views.barGraph.addCategory(id, value);
        }, this);

        $('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.models.userBudget = new TGM.Models.Budget();
        this.models.federalBudget = new TGM.Models.Budget();
        this.views.barGraph.model = this.models.userBudget;
        this.views.barGraph.addBudget("user", this.models.userBudget);
        this.views.barGraph.addBudget("federal", this.models.federalBudget);
        this.views.barGraph.render();

        this.views.emailPage = new TGM.Views.EmailPage({ el: $("#email-page-form") });

        this.views.sidePanes = {
            "budget-allocator": new TGM.Views.BudgetAllocatorPane({ model: this.models.userBudget }),
            "save-budget": new TGM.Views.SaveBudgetPane({ el: $("#save-budget-pane"), model: this.models.userBudget })
        };

        this.views.sidePaneManager = new TGM.Views.SidePaneManager({ el: $("#budget-allocator-tab")});
        this.views.sidePaneManager.addSidePane("budget-allocator", this.views.sidePanes["budget-allocator"]);
        this.views.sidePaneManager.addSidePane("save-budget", this.views.sidePanes["save-budget"]);
    },

    index: function()
    {
        var budgetId = $.jStorage.get('budgetId');

        if (budgetId) {
            this.navigate("budget/" + budgetId, { trigger: true });
        }
    },

    loadBudget: function(id)
    {
        this.models.userBudget.set('_id', id);
        this.models.userBudget.fetch();
    }

});