var userBudget = new TGM.Models.Budget()

$('#budget-allocator .category').each(function() {
    var $el = $(this);
    new TGM.Views.CategoryAllocationView({ el: $el, category: $el.data('id'), model: userBudget });
});