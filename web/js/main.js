var barGraph = new TGM.Views.BarGraphView({ el: $("#visualisation") });

_.each(DATA.categories, function(value, id) {
    TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
    barGraph.addCategory(id, value);
});

TGM.vent = _.extend({}, Backbone.Events);
TGM.userBudget = new TGM.Models.Budget();
TGM.federalBudget = new TGM.Models.Budget();
barGraph.model = TGM.userBudget;
barGraph.addBudget("user", TGM.userBudget);
barGraph.addBudget("federal", TGM.federalBudget);

TGM.budgetAllocatorView = new TGM.Views.BudgetAllocatorView();
barGraph.render();