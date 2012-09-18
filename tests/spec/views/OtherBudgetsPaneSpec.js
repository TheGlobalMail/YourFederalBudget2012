describe("Other Budgets Pane (a.k.a Saved Budgets)", function() {
    var template =  '<div>' +
                        '<div class="your-budget">' +
                            '<a href="#" class="btn no">Create Budget</a>' +
                        '</div>' +
                        '<div class="other-budgets">' +
                            '<div class="other-budgets-inner"></div>' +
                            '<div class="loading-more"></div>' +
                        '</div>' +
                    '</div>';

    var budget, budgets, otherBudgetsPane;

    beforeEach(function() {
        budget = new TGM.Models.Budget();
        budgets = new TGM.Collections.Budgets();
        otherBudgetsPane = new TGM.Views.OtherBudgetsPane({
            el: $(template),
            model: budget,
            collection: budgets
        });
    });


    it("should show the 'Create your budget' button if none are saved", function() {
        expect(otherBudgetsPane.$el).toContain('.btn.no');
    });

    it("should show the users budget if they have one saved", function() {
        budget.set('name', 'Jamsine');
        budget.trigger('sync');

        expect(otherBudgetsPane.$el).not.toContain('.btn.no');
        expect(otherBudgetsPane.$el).toContain('.other-budget');
        expect(otherBudgetsPane.$('.your-budget .other-budget .name')).toHaveText('Jamsine');
    });

});