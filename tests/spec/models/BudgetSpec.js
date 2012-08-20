describe("Budget", function() {
    var budget, sampleData = {
        defense: 50,
        health: 52,
        immigration: 49,
        welfare: 40,
        taxBreaks: 20,
        agriculture: 30,
        education: 35,
        energy: 55
    };

    beforeEach(function() {
        budget = new TGM.Models.Budget();
    });

    it("should be able to set category amounts", function() {
        budget.set('defense', 57);
        expect(budget.get('defense')).toEqual(57);
    });

    it("should be able to non-category attributes", function() {
        budget.set('randomAttribute', 5);
        expect(budget.get('randomAttribute')).toEqual(5);
    });

    it("should be able to set a JSON object", function() {
        budget.set({
            "defense": 42,
            "randomAttribute": "check"
        });

        expect(budget.get('defense')).toEqual(42);
        expect(budget.get('randomAttribute')).toEqual('check');
    });

    it("should be able to calculate it's total", function() {
        budget.set(sampleData)

        expect(budget.getTotal()).toEqual(331);
    });

    it("should cap category amounts so the total doesn't exceed the budget allowance", function() {
        budget.set(sampleData);

        budget.set('defense', 200);
        // budget allowance set in test running (index.php)
        expect(budget.getTotal()).toEqual(400);
        // 400 - (331 - 50) = 119
        expect(budget.get('defense')).toEqual(119);
    });

    it("shouldn't let category value be less than the slider minimum", function() {
        budget.set("defense", -5);

        // min slider value is 0 in config
        expect(budget.get('defense')).toEqual(0);
    });

    it("shouldn't let category value exceed the slider maximum", function() {
        budget.set('defense', 999);

        // max slider value is 364 in config
        expect(budget.get('defense')).toEqual(364);
    });

    it("should ignore anything other than numbers as a category value", function() {
        var current = budget.get('defense');

        budget.set('defense', 'This is a string, not a number');

        expect(budget.get('defense')).toEqual(current);
    });

    it("should reset category to the previous value if you try and set an invalid category amount", function() {
        budget.set('defense', 98);

        budget.set('defense', 'Needs moar stringzzzz');

        expect(budget.get('defense')).toEqual(98);
    });

    it("should reset all categories to defaults and trigger reset", function() {
        var defaults = _.clone(TGM.Models.Budget.prototype.defaults);
        var resetTrigger = false;
        _.extend(TGM.Models.Budget.prototype.defaults, sampleData);

        var budget = new TGM.Models.Budget({ defense: 40, health: 13 });
        budget.on('reset', function() { resetTrigger = true; });
        budget.resetBudget();

        expect(resetTrigger).toBeTruthy();
        expect(budget.get('defense')).toEqual(50);
    });
});