TGM.Views.BudgetAllocatorView = TGM.Views.SidePaneView.extend({

    events: {
        "click #save-budget-btn": "saveBudget",
        "click #reset-budget-btn": "resetBudget"
    },

    el: $('#budget-allocator'),

    categoryViews: {},

    initialize: function()
    {
        _.bindAll(this);

        _.each(this.$('.category'), function(el) {
            var id = $(el).data('id');
            var view = new TGM.Views.CategoryAllocationView({
                el: el,
                category: id,
                model: this.model
            });
            this.categoryViews[id] = view;
        }, this);

        var firstCategoryId = _.chain(this.categoryViews).keys().first().value();

        // collapse all categories except the first one
        _.chain(this.categoryViews)
            .filter(function(view, categoryId) { return categoryId != firstCategoryId; })
            .invoke("hide");

        // currently expanded category is the first one
        this.expandedCategory = this.categoryViews[firstCategoryId];

        this.budgetOverview = new TGM.Views.BudgetOverviewView({ model: this.model });

        // tell everyone the first category is open before we listen to the event ourself
        this.expandedCategory.expand({ force: true, doAnimation: false });
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);
    },

    switchCategory: function(newCategory)
    {
        this.expandedCategory.collapse();
        this.expandedCategory = this.categoryViews[newCategory];
    },

    saveBudget: function()
    {
        TGM.vent.trigger("showSidePane", "save-budget");
    },

    resetBudget: function()
    {
        this.model.resetBudget();
    }

});