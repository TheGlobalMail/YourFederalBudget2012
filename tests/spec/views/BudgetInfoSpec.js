describe('Budget Info View', function() {
    var budgetInfo, budget;

    var $el = $(
        '<div>' +
            '<h1></h1>' +
            '<time></time>' +
            '<div class="bottom"></div>' +
        '</div>'
    );

    beforeEach(function() {
        budget = new TGM.Models.Budget();
        budgetInfo = new TGM.Views.BudgetInfo({ el: $el.clone(), model: budget });
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    it("should render a different budget when it is activated", function() {
        var newBudget = new TGM.Models.Budget({ 'id': 'my-new-budget' });
        var _origInit = TGM.Views.BudgetInfo.prototype.initialize;
        var spy;

        // monkey-patch initialize function to spy before binding events
        TGM.Views.BudgetInfo.prototype.initialize = function() {
            spy = sinon.spy(this, 'render');
            _origInit.apply(this, arguments);
        }

        budgetInfo = new TGM.Views.BudgetInfo({ el: $el.clone(), model: budget });
        TGM.vent.trigger('activeBudget', newBudget);

        expect(spy).toHaveBeenCalledWith(newBudget);
        spy.restore();
        TGM.Views.BudgetInfo.prototype.initialize = _origInit;
    });

    describe("when users budget is active", function() {
        it('should titled Your Budget', function() {
            budgetInfo.render(budget);
            expect(budgetInfo.$title).toHaveText('Your budget');
        });

        it('should hide the bottom', function() {
            budgetInfo.render(budget);
            expect(budgetInfo.$bottom).toHaveCss({ opacity: "0" });
            this.clock.tick(500);
            expect(budgetInfo.$bottom).toHaveCss({ display: 'none' });
        });
    });

    describe("when someone elses budget is active", function() {
        beforeEach(function() {
            budget.set('_id', 'someone-elses-budget');
            budget.set('name', 'Tester');
        });

        it('should show their name in the title', function() {
            budgetInfo.render();

            expect(budgetInfo.$title).toHaveText("Tester's budget");
        });

        it("should show the bottom info", function() {
            budgetInfo.render();
            expect(budgetInfo.$bottom).toHaveCss({ opacity: '100' });
            expect(budgetInfo.$bottom).not.toHaveCss({ display: 'none' });
        });

        describe("render the date the budget was created at", function() {
            it('should render the full date', function() {
                budget.set('createdAt', (new Date(2012, 8, 28)).getTime())
                budgetInfo.render();
                expect(budgetInfo.$time).toHaveHtml('Created Friday 28<super>th</super> September, 2012');
            });

            it('should render 1, 21 or 31 with "st" super script', function() {
                budget.set('createdAt', (new Date(2012, 8, 1)).getTime());
                budgetInfo.render();
                expect(budgetInfo.$time).toHaveHtml('Created Saturday 1<super>st</super> September, 2012');
            });

            it("should render 11 with 'th' superscript", function() {
                budget.set('createdAt', (new Date(2011, 9, 11)).getTime());
                budgetInfo.render();
                expect(budgetInfo.$time).toHaveHtml('Created Tuesday 11<super>th</super> October, 2011');
            });
        });
    });

});