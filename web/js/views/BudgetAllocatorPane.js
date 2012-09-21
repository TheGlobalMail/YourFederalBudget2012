TGM.Views.BudgetAllocatorPane = TGM.Views.SidePane.extend({

    events: {
        "click .reset-budget-btn": "resetBudget"
    },

    categorys: {},

    initialize: function()
    {
        _.bindAll(this);
        this.$saveButton = this.$('.save-budget-btn');

        this.model.on('sync', this.updateLabels);

        if (!this.model.isNew()) {
            this.updateLabels();
        }

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
        // currently expanded category is the first one
        this.activeCategory = this.categorys[firstCategoryId];
        this.budgetOverview = new TGM.Views.BudgetOverview({ model: this.model, el: this.$("#budget-overview") });

        // tell everyone the first category is open before we listen to the event ourself
        this.on('shown', this.onShown);
        this.activeCategory.expand();
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);
    },

    switchCategory: function(newCategory)
    {
        this.activeCategory.collapse();
        this.activeCategory = this.categorys[newCategory];
    },

    resetBudget: function()
    {
        this.model.resetBudget();
    },

    onShown: function()
    {
        var href = this.model.isNew() ? "/budget/save" : "/budget/" + this.model.id + "/save";
        this.$saveButton.prop('href', href);
    },

    updateLabels: function()
    {
        this.$saveButton
            .css('width', '+=11px')
            .find('span')
                .text('Update Budget');
    }

});