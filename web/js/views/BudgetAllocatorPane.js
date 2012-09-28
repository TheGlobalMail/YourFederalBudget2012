TGM.Views.BudgetAllocatorPane = TGM.Views.SidePane.extend({

    events: {
        "click .reset-budget-btn": "resetBudget",
        "click .save-budget-btn": "saveBudget"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.categories = {};
        this.$saveButton = this.$('.save-budget-btn');

        this.model.on('sync', this.updateLabels);

        if (!this.model.isNew()) {
            this.updateLabels();
        }

        // create a Category Allocation view for each category
        _.each(this.$('.category'), function(el) {
            var id = $(el).data('id');
            var view = new TGM.Views.CategoryAllocation({
                el: el,
                category: id,
                model: this.model
            });
            this.categories[id] = view;
        }, this);

        var firstCategoryId = _.chain(this.categories).keys().first().value();
        // currently expanded category is the first one
        this.activeCategory = this.categories[firstCategoryId];
        // hide the rest
        _.chain(this.categories)
            .filter(function(view, categoryId) { return categoryId != firstCategoryId; })
            .invoke("collapse");

        // setup child views
        this.budgetModeToggler = new TGM.Views.BudgetModeToggler({ model: this.model, el: this.$(".toggle") });
        this.budgetOverview = new TGM.Views.BudgetOverview({ model: this.model, el: this.$("#budget-overview") });

        this.on('shown', this.onShown);
        this.on('hidden', this.onHidden);

        // tell everyone the first category is open before we listen to the event ourself
        this.activeCategory.expand();
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.switchCategory);
    },

    switchCategory: function(newCategory)
    {
        this.activeCategory.collapse();
        this.activeCategory = this.categories[newCategory];
    },

    resetBudget: function()
    {
        this.model.resetBudget();
    },

    onShown: function()
    {
        var href = this.model.isNew() ? "/budget/save" : "/budget/" + this.model.id + "/save";
        this.$saveButton.prop('href', href);

        if ($.jStorage.get('userBudget')) {
            this.$saveButton.removeClass('disabled');
        } else {
            this.$saveButton.addClass('disabled');
            this.model.on('change', function off() {
                if ($.jStorage.get('userBudget')) {
                    this.$saveButton.removeClass('disabled');
                    this.model.off('changed', off, this);
                }
            }, this);
        }
    },

    onHidden: function()
    {
        this.budgetOverview.closeBudgetFullyAllocatedTooltip();
        this.budgetModeToggler.closeTooltips();
    },

    updateLabels: function()
    {
        this.$saveButton
            .css('width', '+=11px')
            .find('span')
                .text('Update Budget');
    },

    saveBudget: function(e)
    {
        if (this.$saveButton.hasClass('disabled')) {
            e.preventDefault();
            return false;
        }
    }

});