describe("BudgetOverview", function() {
    var budgetOverviewView, model, sampleData = {
        defense: 50,
        health: 52,
        immigration: 49,
        welfare: 40,
        taxBreaks: 20,
        agriculture: 30,
        education: 35,
        energy: 55
    };

    var $el = $('<div><div id="budget-total">0</div><div class="bar"></div></div>');

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        budgetOverviewView = new TGM.Views.BudgetOverviewView({ model: model, el: $el });
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    describe("Budget Total", function() {
        it("should updated the exact total amount when the model changes", function() {
            model.set('defense', 13);
            this.clock.tick(110);
            expect(budgetOverviewView.$el.find("#budget-total").text()).toEqual("294");
        });

        it("should update the allowance bar width", function() {
            var currentWidth = budgetOverviewView.$progress.width();
            model.set('defense', 60);
            expect(budgetOverviewView.$progress.width()).toBeGreaterThan(currentWidth);
        });
    });
});