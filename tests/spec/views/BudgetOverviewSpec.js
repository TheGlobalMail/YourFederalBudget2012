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
            '<div class="toggle">' +
                '<div class="side active federal-spending" data-name="federal-spending"></div>' +
                '<div class="side your-pretax-income" data-name="your-pretax-income"></div>' +
            '</div>' +
            '<div id="budget-total">0</div>' +
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
            expect(budgetOverview.$el.find("#budget-total")).toHaveText("58.9b");
        });

        it("should update the allowance bar width", function() {
            var currentWidth = budgetOverview.$progress.width();
            model.set('defense', 10);
            expect(budgetOverview.$progress.width()).toBeGreaterThan(currentWidth);
        });
    });

    describe("Federal/Income Toggles", function() {
        it("should have federal budget toggled by default", function() {
            expect(budgetOverview.$currentSide).toHaveData('name', 'federal-spending');
        });

        it("should not re-toggle the active side", function() {
            var spy = sinon.spy();
            TGM.vent.on('baseCalculation', spy);

            budgetOverview.$currentSide.click();

            expect(spy).not.toHaveBeenCalled();
            TGM.vent.off('baseCalculation', spy);
        });

        it("should activate the non-active side when clicked", function() {
            var spy = sinon.spy();
            TGM.vent.on('baseCalculation', spy);

            budgetOverview.$('.side.your-pretax-income').trigger('click');

            expect(budgetOverview.$currentSide).toHaveClass('your-pretax-income');
            expect(budgetOverview.$currentSide).toHaveClass('active');
            expect(budgetOverview.$('.federal-spending')).not.toHaveClass('active');
            expect(spy).toHaveBeenCalledWith('your-pretax-income');

            TGM.vent.off('baseCalculation', spy);
        });
    });
});