window.location.origin = window.location.origin || window.location.protocol+'//'+window.location.host+'/';

var TGM = { Views: {}, Models: {}, Routers: {}, Collections: {} };
TGM.vent = _.extend({}, Backbone.Events);
TGM.vent.publish = TGM.vent.trigger;
TGM.Color = net.brehaut.Color;

(function() {
    TGM.has = {};
    TGM.has.SVG = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    TGM.has.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    if (!TGM.has.SVG) {
        $('html').addClass('no-svg');
    }
})();

Backbone.View.prototype.close = function() {
    this.remove();
    this.off();
    this.dispose();

    this.onClose && this.onClose();
}

_.string.ownerize = function(string, quot) {
    quot = quot || "&rsquo;";
    return string + (_.string.endsWith(string, 's') ? quot : quot + "s");
}

_.mixin(_.string.exports());

TGM.bootstrappers = {

    appViews: function($find)
    {
        this.views.application = new TGM.Views.Application({ el: $('body') });
        this.views.moreInfo = new TGM.Views.MoreInfo({ el: $find("#more-info") });
    },

    models: function($find)
    {
        _.each(DATA.categories, function(value, id) {
            TGM.Models.Budget.prototype.defaults[id] = 0;
        }, this);

        this.models.averageBudget = new TGM.Models.Budget(DATA.averageBudget);
        this.models.userBudget = new TGM.Models.Budget();
        this.models.federalBudget = new TGM.Models.Budget();
        this.models.activeBudget = this.models.userBudget;

        _.each(DATA.categories, function(value, id) {
            this.models.federalBudget.set(id, value.federalAllocation);
            this.models.userBudget.set(id, 3);
        }, this);

        this.collections.budgets = new TGM.Collections.Budgets();
    },

    barGraph: function($find)
    {
        this.views.barGraph = new TGM.Views.BarGraph({ el: $find("#visualisation") });
        this.views.budgetInfo = new TGM.Views.BudgetInfo({ el: $("#budget-info"), model: this.models.activeBudget });

        _.each(DATA.categories, function(value, id) {
            this.views.barGraph.addCategory(id, value);
        }, this);

        this.views.barGraph.model = this.models.userBudget;
        this.views.barGraph.addBudget("user", this.models.userBudget);
        this.views.barGraph.addBudget("average", this.models.averageBudget);
        this.views.barGraph.addBudget("federal", this.models.federalBudget);
        this.views.barGraph.render();

        this.views.barCategories = new TGM.Views.BarCategories({ el: $find("#bar-categories") });
    },

    sidePanes: function($find)
    {
        this.views.sidePaneManager = new TGM.Views.SidePaneManager({ el: $find("#left-column"), model: this.models.userBudget });
        this.views.sidePaneManager.addSidePanes({
            "budget-allocator":     new TGM.Views.BudgetAllocatorPane({ el: $find("#budget-allocator"), model: this.models.userBudget }),
            "save-budget":          new TGM.Views.SaveBudgetPane({ el: $find("#save-budget-pane"), model: this.models.userBudget }),
            "share-budget":         new TGM.Views.ShareBudgetPane({ el: $find("#share-budget-pane"), model: this.models.userBudget }),
            "other-budgets":        new TGM.Views.OtherBudgetsPane({ el: $find("#other-budgets-pane"), model: this.models.userBudget, collection: this.collections.budgets })
        });
    },

    loadBudgets: function()
    {
        var budgetId = $.jStorage.get('budgetId');
        var clientId = $.jStorage.get('clientId');

        var fetchSuccess = _.bind(function() {
            if (clientId && (!this.models.userBudget.get('clientId') || this.models.userBudget.get('clientId') != clientId)) {
                $.jStorage.deleteKey('budgetId');
                $.jStorage.deleteKey('clientId');
                $.jStorage.deleteKey('userBudget');
            } else {
                this.models.userBudget.tryRestoreFromCache();

                if (!this.models.userBudget.isNew()) {
                    TGM.vent.trigger('updateMode');
                }
            }

            setTimeout(this.views.application.hideAppLoadingOverlay, 200);
        }, this);

        var fetchError = function(model, response) {
            if (response.status == 404) {
                $.jStorage.deleteKey('budgetId');
                $.jStorage.deleteKey('clientId');
                $.jStorage.deleteKey('userBudget');
            }
            fetchSuccess();
        };

        if (budgetId) {
            this.models.userBudget.set('_id', budgetId);
            this.models.userBudget.fetch({
                success: fetchSuccess,
                error: fetchError,
                data: {
                    clientId: clientId
                }
            });
        } else {
            fetchSuccess();
        }
    }

};