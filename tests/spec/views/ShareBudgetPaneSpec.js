describe("Share Budget pane", function() {
    var template =
        '<div>' +
            '<h1>New <div class="budget-name"></div></h1>' +
            '<div class="budget-url"></div>' +
            '<div class="share-buttons"></div>' +
        '</div>'
    ;
    var budget, shareBudgetPane;

    beforeEach(function() {
        budget = new TGM.Models.Budget();
        shareBudgetPane = new TGM.Views.ShareBudgetPane({ el: $(template), model: budget });
    });

    describe("The top message", function() {
        it("should show the new budget message by default", function() {
            expect(shareBudgetPane.$('h1')).toHaveText('New');
        });

        it("should update the message when the budget name changes", function() {
            budget.set('name', 'Testering');
            expect(shareBudgetPane.$('.budget-name')).toHaveText('Testering');
        });

        it("should update the message template if the budget isn't new", function() {
            budget.set('name', 'Updatering');
            TGM.vent.trigger('updateMode');
            expect(shareBudgetPane.$('h1')).toContain('.budget-name');
            expect(shareBudgetPane.$('h1')).toHaveText(/updating/);
        });
    });
});