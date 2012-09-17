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

    var $el = $('<div><div id="budget-total">0</div><div class="bar"></div></div>');

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        budgetOverview = new TGM.Views.BudgetOverview({ model: model, el: $el });
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    describe("Budget Total", function() {
        it("should update the remaning budget allowance when the model changes", function() {
            model.set('defense', 13);
            this.clock.tick(110);
            expect(budgetOverview.$el.find("#budget-total").text()).toEqual("58.9");
        });

        it("should update the allowance bar width", function() {
            var currentWidth = budgetOverview.$progress.width();
            model.set('defense', 10);
            expect(budgetOverview.$progress.width()).toBeGreaterThan(currentWidth);
        });
    });
});