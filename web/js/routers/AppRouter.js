TGM.Routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                 "index",
        "budget/save":      "saveBudget",
        "budget/:id/save":  "saveBudget",
        "budget/:id/edit":  "editBudget",
        "budget/:id":       "viewBudget",
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
            // default route is to edit their saved budget
            this.goto("budget", this.models.userBudget.id, "edit");
        } else {
            this.models.activeBudget = this.models.userBudget;
            TGM.vent.trigger('activeBudget', this.models.userBudget);
            TGM.vent.trigger('showSidePane', 'budget-allocator');
        }
    },

    viewBudget: function(id)
    {
        if (this.models.userBudget.id == id) {
            this.models.activeBudget = this.models.userBudget;
        } else {
            // try and get the model from the collection first
            this.models.activeBudget = this.collections.budgets.get(id);
        }

        var fetchSuccess = _.bind(function() {
            TGM.vent.trigger('activeBudget', this.models.activeBudget);
        }, this);

        if (this.models.activeBudget) {
            fetchSuccess(); // budget already in memory
        } else {
            // budget not loaded so we have to fetch
            this.models.activeBudget = new TGM.Models.Budget({ _id: id });
            this.collections.budgets.unshift(this.models.activeBudget);

            var fetchError = _.bind(function(model, response) {
                if (response.status == 404) {
                    // budget not found, just show the Saved Budgets pane
                    this.models.activeBudget = this.models.userBudget;
                    this.goto("budgets");
                }
            }, this);

            this.models.activeBudget.fetch({ success: fetchSuccess, error: fetchError });
        }

        TGM.vent.trigger('showSidePane', 'other-budgets');
    },

    editBudget: function(id)
    {
        if (this.models.userBudget.id != id) {
            // can't edit budgets if they aren't yours
            this.goto("budget", id);
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
        if (this.models.userBudget.isNew()) {
            this.models.activeBudget = this.collections.budgets.first();

            if (!this.models.activeBudget) {
                // collection doesn't have any load, so only trigger activeBudget once fetched
                this.collections.budgets.on('fetched', function() {
                    this.models.activeBudget = this.collections.budgets.first();
                    TGM.vent.trigger('activeBudget', this.models.activeBudget);
                }, this);
            } else {
                // collection has model in memory, trigger now
                TGM.vent.trigger('activeBudget', this.models.activeBudget);
            }
        } else {
            // user budget is saved, let's show theirs
            this.models.activeBudget = this.models.userBudget;
            TGM.vent.trigger('activeBudget', this.models.activeBudget);
        }

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