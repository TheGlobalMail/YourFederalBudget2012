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

    initialize: function(options)
    {
        _.bindAll(this);
        options.bootstrap && options.bootstrap.call(this);
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
            // try and get the model from the collection first
            this.models.activeBudget = this.collections.budgets.get(id);

            var fetchSuccess = _.bind(function() {
                TGM.vent.trigger('activeBudget', this.models.activeBudget);
            }, this);

            if (this.models.activeBudget) {
                fetchSuccess();
            } else {
                this.models.activeBudget = new TGM.Models.Budget({ _id: id });

                var fetchError = _.bind(function(model, response) {
                    if (response.status == 404) {
                        // clear model so isNew will work
                        this.models.activeBudget = this.models.userBudget;
                        this.goto("");
                    }
                }, this);

                this.models.activeBudget.fetch({ success: fetchSuccess, error: fetchError });
            }

            TGM.vent.trigger('showSidePane', 'other-budgets');
        } else {
            this.models.activeBudget = this.models.userBudget;
            TGM.vent.trigger('activeBudget', this.models.activeBudget);
            TGM.vent.trigger('showSidePane', 'budget-allocator');
        }
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

    goto: function()
    {
        // Create array of strings from arguments:
        var args = _.map(Array.prototype.slice.call(arguments, 0), function(arg) {
            // Join arrays, evaluate functions, stringify objects, leave strings/numbers:
            return _.isArray(arg) ? arg.join(',') : _.isFunction(arg) ? arg() : _.isObject(arg) ? $.param(arg) : arg;
        });

        var uri = (!Backbone.history.options.pushState ? '#' : '') + args.join('/');
        this.navigate(uri, { trigger: true });
    }

});