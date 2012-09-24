describe("Budget Model", function() {
    var budget, sampleData = {
        defense: 5.0,
        health: 5.2,
        immigration: 4.9,
        welfare: 4.0,
        taxBreaks: 2.0,
        agriculture: 3.0,
        education: 3.5,
        energy: 5.5
    };

    beforeEach(function() {
        $.jStorage.flush();
        budget = new TGM.Models.Budget();
    });

    afterEach(function() {
        $.jStorage.flush();
    });

    it("should be able to set category amounts", function() {
        budget.set('defense', 5.7);
        expect(budget.get('defense')).toEqual(5.7);
    });

    it("should be able to non-category attributes", function() {
        budget.set('randomAttribute', 5);
        expect(budget.get('randomAttribute')).toEqual(5);
    });

    it("should be able to set a JSON object", function() {
        budget.set({
            "defense": 4.2,
            "randomAttribute": "check"
        });

        expect(budget.get('defense')).toEqual(4.2);
        expect(budget.get('randomAttribute')).toEqual('check');
    });

    it("should be able to calculate it's total", function() {
        budget.set(sampleData);

        expect(budget.getTotal()).toEqual(33.1);
    });

    it("should cap category amounts so the total doesn't exceed the budget allowance", function() {
        budget.set(sampleData);

        budget.set('health', 50);
        budget.set('defense', 50);
        // budget allowance set in test running (index.php)
        expect(budget.getTotal()).toEqual(100);
        // 33.1-5.2+50-5+50-100 = 22.9
        expect(budget.get('defense')).toEqual(27.1);
    });

    it("shouldn't let category value be less than the slider minimum", function() {
        budget.set("defense", -5);

        // min slider value is 0 in config
        expect(budget.get('defense')).toEqual(0);
    });

    it("shouldn't let category value exceed the slider maximum", function() {
        budget.set('defense', 999);

        // max slider value is 364 in config
        expect(budget.get('defense')).toEqual(DATA.sliderConfig.max);
    });

    it("should ignore anything other than numbers as a category value", function() {
        var current = budget.get('defense');

        budget.set('defense', 'This is a string, not a number');

        expect(budget.get('defense')).toEqual(current);
    });

    it("should reset category to the previous value if you try and set an invalid category amount", function() {
        budget.set('defense', 9.8);
        budget.set('defense', 'Needs moar stringzzzz');

        expect(budget.get('defense')).toEqual(9.8);
    });

    it("should reset all categories to defaults and trigger reset", function() {
        var defaults = _.clone(TGM.Models.Budget.prototype.defaults);
        var resetSpy = sinon.spy();
        _.extend(TGM.Models.Budget.prototype.defaults, sampleData);

        var budget = new TGM.Models.Budget({ defense: 40, health: 13 });
        budget.on('reset', resetSpy);
        budget.resetBudget();

        expect(resetSpy).toHaveBeenCalledOnce();
        expect(budget.get('defense')).toEqual(5.0);
        TGM.Models.Budget.prototype.defaults = defaults;
    });

    describe("Budget caching", function() {
        it("should cache the budget on request", function() {
            budget.set({
                defense: 12.3,
                health: 6.9
            });
            var spy = sinon.spy($.jStorage, "set");

            budget.tryCaching();
            expect(spy).toHaveBeenCalledWith('userBudget', budget.toJSON());
        });

        it("should restore cached values", function() {
            budget.set('defense', 3.2);
            budget.tryCaching();

            budget.set('defense', 4.3);
            budget.tryRestoreFromCache();
            expect(budget.get('defense')).toEqual(3.2);
        });

        it("should reset to last saved for existing budgets", function() {
            budget.set('_id', 'testing-id');
            budget.set('defense', 2.1);
            var defaults = budget.toJSON();

            budget.tryCaching();
            budget.tryRestoreFromCache();
            budget.resetBudget();

            expect(budget.toJSON()).toEqual(defaults);
        });
    });

    describe("Income-based categories", function() {
        beforeEach(function() {
            budget = new TGM.Models.Budget({ defense: 20, health: 17, welfare: 13 });
        });

        it("should calculate tax paid on pretax income", function() {
            var taxPaid = budget.calculateTaxPaidOnIncome(3000);
            expect(taxPaid).toEqual(1000);
        });

        it("should calculate category allocation based on pretax income", function() {
            budget.calculatePretaxIncomeAmounts(30000);
            var defense = budget.getIncomeBasedAmount('defense');

            expect(defense).toEqual(2000); // exact dollars, not in billions :)
        });

        it("should calculate the income-based budget total", function() {
            budget.calculatePretaxIncomeAmounts(30000);

            expect(budget.getIncomeBasedTotal()).toEqual(5000);
        });
    });
});