var barGraph = new TGM.Views.BarGraph({ el: $("#visualisation") });
var moreInfo = new TGM.Views.MoreInfo({ el: $("#more-info") });

_.each(DATA.categories, function(value, id) {
    TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
    barGraph.addCategory(id, value);
});

$('.popover-link').arrowPopover({
    actionToActivatePopover: 'click'
});

TGM.userBudget = new TGM.Models.Budget({
    _id: $.jStorage.get('budgetId'),
});

TGM.federalBudget = new TGM.Models.Budget();
barGraph.model = TGM.userBudget;
barGraph.addBudget("user", TGM.userBudget);
barGraph.addBudget("federal", TGM.federalBudget);
barGraph.render();

emailPage = new TGM.Views.EmailPage({ el: $("#email-page-form") });

TGM.sidePanes = {
    "budget-allocator": new TGM.Views.BudgetAllocatorPane({ model: TGM.userBudget }),
    "save-budget": new TGM.Views.SaveBudgetPane({ el: $("#save-budget-pane"), model: TGM.userBudget })
};
sidePaneManager = new TGM.Views.SidePaneManager({ el: $("#budget-allocator-tab")});
sidePaneManager.addSidePane("budget-allocator", TGM.sidePanes["budget-allocator"]);
sidePaneManager.addSidePane("save-budget", TGM.sidePanes["save-budget"]);

TGM.userBudget.fetch();