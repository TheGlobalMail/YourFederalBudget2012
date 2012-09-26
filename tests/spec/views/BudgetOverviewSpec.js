describe("Budget Over View", function() {
    var budgetOverview, model, sampleData = {
        defense: 5.0,
        health: 5.2,
        immigration: 4.9,
        welfare: 4.0,
        taxBreaks: 2.0,
        agriculture: 3.0,
        education: 3.5,
        energy: 5.5
    };

    var $el = $(
        '<div>' +
            '<div id="budget-total">0</div>' +
            '<div class="progress-bar"></div>' +
            '<div class="bar"></div>'+
        '</div>'
    );

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        budgetOverview = new TGM.Views.BudgetOverview({ model: model, el: $el.clone() });
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    describe("Budget Total", function() {
        it("should update the remaning budget allowance when the model changes", function() {
            model.set('defense', 13);
            this.clock.tick(110);
            expect(budgetOverview.$el.find("#budget-total")).toHaveText("$58.9b");
        });

        it("should update the allowance bar width", function() {
            var currentWidth = budgetOverview.$progress.width();
            model.set('defense', 10);
            expect(budgetOverview.$progress.width()).toBeGreaterThan(currentWidth);
        });
    });

    describe("Full budget allocation", function() {
        it("should not show the budget fully allocated tooltip when they have tax dollars remaining", function() {
            expect(budgetOverview.budgetFullyAllocatedTooltip.tip()).toBeHidden();
            expect(budgetOverview.$('.progress-bar')).not.toHaveClass('budget-fully-allocated');
        });

        it("should show the budget fully allocated tooltip when they have no tax dollars remaining", function() {
            budgetOverview.budgetFullyAllocated(true);

            expect(budgetOverview.budgetFullyAllocatedTooltip.tip()).toBeVisible();
            expect(budgetOverview.$('.progress-bar')).toHaveClass('budget-fully-allocated');
        });

        it("should hide the budget fully allocated tooltip when they free up tax dollars again", function() {
            budgetOverview.budgetFullyAllocated(true);
            budgetOverview.budgetFullyAllocated(false);
            this.clock.tick(800); // tick for fade animation?

            expect(budgetOverview.budgetFullyAllocatedTooltip.tip()).toBeHidden();
            expect(budgetOverview.$('.progress-bar')).not.toHaveClass('budget-fully-allocated');
        });
    });
});