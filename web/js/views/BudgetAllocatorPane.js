TGM.Views.BudgetAllocatorPane = TGM.Views.SidePane.extend({

    events: {
        "click #save-budget-btn": "saveBudget",
        "click #reset-budget-btn": "resetBudget"
    },

    el: $('#budget-allocator'),

    categorys: {},

    initialize: function()
    {
        _.bindAll(this);

        _.each(this.$('.category'), function(el) {
            var id = $(el).data('id');
            var view = new TGM.Views.CategoryAllocation({
                el: el,
                category: id,
                model: this.model
            });
            this.categorys[id] = view;
        }, this);

        var firstCategoryId = _.chain(this.categorys).keys().first().value();

        // collapse all categories except the first one
        _.chain(this.categorys)
            .filter(function(view, categoryId) { return categoryId != firstCategoryId; })
            .invoke("hide");

        // currently expanded category is the first one
        this.expandedCategory = this.categorys[firstCategoryId];

        this.budgetOverview = new TGM.Views.BudgetOverview({ model: this.model, el: $("#budget-overview") });

        // tell everyone the first category is open before we listen to the event ourself
        this.expandedCategory.expand({ force: true, doAnimation: false });
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);
    },

    switchCategory: function(newCategory)
    {
        this.expandedCategory.collapse();
        this.expandedCategory = this.categorys[newCategory];
    },

    saveBudget: function()
    {
        if (!this.model.isNew()) {
            TGM.vent.trigger("showSidePane", "share-budget");
        } else {
            TGM.vent.trigger("showSidePane", "save-budget");
        }
    },

    resetBudget: function()
    {
        this.model.resetBudget();
    }

});