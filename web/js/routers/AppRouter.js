TGM.Routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                 "index",
        "budget/save":      "saveBudget",
        "budget/:id/save":  "saveBudget",
        "budget/:id":       "loadBudget",
        "budgets":          "viewBudgets"
    },

    views: {},
    models: {},
    collections: {},

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
        this.models.activeBudget = this.models.userBudget;

        this.collections.budgets = new TGM.Collections.Budgets();

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
            "other-budgets":        new TGM.Views.OtherBudgetsPane({ el: $("#other-budgets-pane"), model: this.models.userBudget, collection: this.collections.budgets })
        });

        var budgetId = $.jStorage.get('budgetId');
        if (budgetId) {
            this.models.userBudget.set('_id', budgetId);
            this.models.userBudget.fetch();
        }
    },

    index: function()
    {
        if (!this.models.userBudget.isNew()) {
            this.goto("budget", this.models.userBudget.id);
        } else {
            TGM.vent.trigger('showSidePane', 'budget-allocator');
        }
    },

    loadBudget: function(id)
    {
        // refactor and use active budget
        if (this.models.userBudget.id != id) {
            this.models.userBudget.set('_id', id);

            var fetchError = _.bind(function(model, response) {
                if (response.status == 404) {
                    if (id == $.jStorage.get('budgetId')) {
                        $.jStorage.deleteKey('budgetId');
                        $.jStorage.deleteKey('clientId');
                    }
                    // clear ID so model.isNew() will work
                    this.models.userBudget.unset('_id');
                    this.goto("");
                }
            }, this);

            this.models.userBudget.fetch({ error: fetchError });
        }

        TGM.vent.trigger('showSidePane', 'budget-allocator');
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

        // refactor and use activeBudget
        this.models.userBudget.set('_id', id);

        var fetchError = _.bind(function(model, response) {
            if (response.status == 404) {
                this.goto("");
            }
        }, this);

        this.models.userBudget.fetch({ success: success, error: fetchError });
    },

    viewBudgets: function()
    {
        TGM.vent.trigger('showSidePane', 'other-budgets');
    },

    goto: function(slug)
    {
        slug = slug || "";

        // Create array of strings from arguments:
        var args = _.map(Array.prototype.slice.call(arguments, 1), function(arg) {
            // Join arrays, evaluate functions, stringify objects, leave strings/numbers:
            return _.isArray(arg) ? arg.join(',') : _.isFunction(arg) ? arg() : _.isObject(arg) ? $.param(arg) : arg;
        });

        var uri = (!Backbone.history.options.pushState ? '#' : '') + slug + '/' + args.join('/');

        this.navigate(uri, { trigger: true });
    }

});