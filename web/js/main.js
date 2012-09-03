var barGraph = new TGM.Views.BarGraphView({ el: $("#visualisation") });
var moreInfoView = new TGM.Views.MoreInfoView({ el: $("#more-info") });

_.each(DATA.categories, function(value, id) {
    TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
    barGraph.addCategory(id, value);
});

$('.popover-link').arrowPopover({
    actionToActivatePopover: 'click'
});

TGM.userBudget = new TGM.Models.Budget();
TGM.federalBudget = new TGM.Models.Budget();
barGraph.model = TGM.userBudget;
barGraph.addBudget("user", TGM.userBudget);
barGraph.addBudget("federal", TGM.federalBudget);
barGraph.render();

emailPageView = new TGM.Views.EmailPageView({ el: $("#email-page-form") });

TGM.sidePanes = {
    "budget-allocator": new TGM.Views.BudgetAllocatorView({ model: TGM.userBudget }),
    "save-budget": new TGM.Views.SaveBudgetPaneView({ el: $("#save-budget-pane") })
};
sidePaneManager = new TGM.Views.SidePaneManagerView({ el: $("#budget-allocator-tab")});
sidePaneManager.addSidePane("budget-allocator", TGM.sidePanes["budget-allocator"]);
sidePaneManager.addSidePane("save-budget", TGM.sidePanes["save-budget"]);