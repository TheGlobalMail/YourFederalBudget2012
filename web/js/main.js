_.each(DATA.categories, function(value, id) {
    TGM.Models.Budget.prototype.defaults[id] = value.federalAllocation;
});

var userBudget = new TGM.Models.Budget()

$('#budget-allocator .category').each(function() {
    var $el = $(this);
    new TGM.Views.CategoryAllocationView({ el: $el, category: $el.data('id'), model: userBudget });
});