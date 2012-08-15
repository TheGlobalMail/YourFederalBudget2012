TGM.Views.BudgetAllocatorView = Backbone.View.extend({

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

        _.chain(this.categoryViews)
            .rest(1)
            .invoke("hide");

        this.expandedCategory = this.categoryViews[0];
    },

    switchCategory: function(newCategory)
    {
        console.log(arguments);
        this.expandedCategory.collapse();
        this.expandedCategory = newCategory;
    }

});