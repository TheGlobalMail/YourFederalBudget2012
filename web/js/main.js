_.each(DATA.categories, function(value, id) {
    TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
});

TGM.vent = _.extend({}, Backbone.Events);
TGM.userBudget = new TGM.Models.Budget()

TGM.budgetAllocatorView = new TGM.Views.BudgetAllocatorView({ el: $('#budget-allocator') });