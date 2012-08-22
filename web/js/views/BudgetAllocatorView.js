TGM.Views.BudgetAllocatorView = Backbone.View.extend({

    el: $('#budget-allocator'),

    initialize: function()
    {
        _.bindAll(this);
        this.categoryViews = [];

        _.each(this.$('.category'), function(el) {
            var view = new TGM.Views.CategoryAllocationView({
                el: $(el),
                category: $(el).data('id'),
                model: TGM.userBudget
            });
            this.categoryViews.push(view);
        }, this);

        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);

        // collapse all categories except the first one
        _.chain(this.categoryViews)
            .rest(1)
            .invoke("hide");

        // currently expanded category is the first one
        this.expandedCategory = this.categoryViews[0];

        this.budgetOverview = new TGM.Views.BudgetOverviewView({ model: TGM.userBudget });
    },

    switchCategory: function(newCategory)
    {
        this.expandedCategory.collapse();
        this.expandedCategory = newCategory;
    }

});