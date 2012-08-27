TGM.Views.BudgetAllocatorView = Backbone.View.extend({

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
                model: TGM.userBudget
            });
            this.categoryViews[id] = view;
        }, this);

        var firstCategoryId = _.chain(this.categoryViews).keys().first().value();

        // collapse all categories except the first one
        _.chain(this.categoryViews)
            .filter(function(view, categoryId) { return categoryId != firstCategoryId; })
            .invoke("hide");

        // currently expanded category is the first one
        this.expandedCategory = this.categoryViews[0];

        this.budgetOverview = new TGM.Views.BudgetOverviewView({ model: TGM.userBudget });

        // tell everyone the first category is open before we listen to the event ourself
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', firstCategoryId);
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);
    },

    switchCategory: function(newCategory)
    {
        this.expandedCategory.collapse();
        this.expandedCategory = this.categoryViews[newCategory];
    }

});