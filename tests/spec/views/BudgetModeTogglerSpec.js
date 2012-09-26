describe("Budget Mode Toggler", function() {
    var budgetModeToggler;
    var $el = $(
        '<div class="toggle">' +
            '<div class="side active federal-spending" data-name="federal-spending"></div>' +
            '<div class="side your-pretax-income" data-name="your-pretax-income">' +
                '<input type="number">' +
            '</div>' +
        '</div>'
    );
    var sampleData = {
        defense: 5.0,
        health: 5.2,
        immigration: 4.9,
        welfare: 4.0,
        taxBreaks: 2.0,
        agriculture: 3.0,
        education: 3.5,
        energy: 5.5
    };
    var budget;

    beforeEach(function() {
        budget = new TGM.Models.Budget(sampleData);
        budgetModeToggler = new TGM.Views.BudgetModeToggler({ model: budget, el: $el.clone() });
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    it("should have federal spending mode toggled by default", function() {
        expect(budgetModeToggler.$currentBudgetMode).toHaveData('name', 'federal-spending');
    });

    it("should not re-toggle a mode when it's active", function() {
        var spy = sinon.spy();
        TGM.vent.on('budgetModeChange', spy);

        budgetModeToggler.$currentBudgetMode.click();

        expect(spy).not.toHaveBeenCalled();
        TGM.vent.off('budgetModeChange', spy);
    });

    it("should activate a non-active budget mode when clicked", function() {
        var spy = sinon.spy();
        TGM.vent.on('budgetModeChange', spy);

        budgetModeToggler.$('.side.your-pretax-income').trigger('click');

        expect(budgetModeToggler.$currentBudgetMode).toHaveClass('your-pretax-income');
        expect(budgetModeToggler.$currentBudgetMode).toHaveClass('active');
        expect(budgetModeToggler.$('.federal-spending')).not.toHaveClass('active');
        expect(spy).toHaveBeenCalledWith('your-pretax-income');

        TGM.vent.off('budgetModeChange', spy);
    });

    describe("Your Pre-tax income mode", function() {
        it("should attempt to recalculate tax paid on income when activating the pre-tax income mode", function() {
            var spy = sinon.spy(budgetModeToggler, "recalculateIncomeBasedAmounts");

            budgetModeToggler.$('.side.your-pretax-income').trigger('click');

            expect(spy).toHaveBeenCalled();
            budgetModeToggler.recalculateIncomeBasedAmounts.restore();
        });

        it("should calculate tax paid on the amount in the pre-tax income field", function() {
            var spy = sinon.spy();
            var modelSpy = sinon.spy(budgetModeToggler.model, "calculatePretaxIncomeAmounts");
            budgetModeToggler.model.on('change pretaxIncomeChange', spy);
            budgetModeToggler.$pretaxIncome.val('34321');

            budgetModeToggler.recalculateIncomeBasedAmounts();
            this.clock.tick(300); // tick for debounce

            expect(modelSpy).toHaveBeenCalledWith(34321);
            expect(spy).toHaveBeenCalledTwice();
            budgetModeToggler.model.calculatePretaxIncomeAmounts.restore();
        });

        it("should set tax paid to zero for incomes under 18000", function() {
            var modelSpy = sinon.spy(budgetModeToggler.model, "calculatePretaxIncomeAmounts");
            budgetModeToggler.$pretaxIncome.val('17999');

            budgetModeToggler.recalculateIncomeBasedAmounts();
            this.clock.tick(300); // tick for debounce

            expect(modelSpy).toHaveBeenCalledWith(0);
            budgetModeToggler.model.calculatePretaxIncomeAmounts.restore();
        });
    });
});