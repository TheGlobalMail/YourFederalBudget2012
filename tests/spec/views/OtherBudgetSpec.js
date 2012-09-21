describe("Other Budget View", function() {
    var otherBudgetView, budget = new TGM.Models.Budget({ name: 'Other Budget', _id: 'some-budget-id' });

    beforeEach(function() {
        otherBudgetView = new TGM.Views.OtherBudget({ model: budget });
    });

    it("should render with a <div> if it's editable", function() {
        otherBudgetView = new TGM.Views.OtherBudget({ editable: true, model: budget });
        otherBudgetView.render();
        expect(otherBudgetView.$el).toBe('div.other-budget');
    });

    it("should render an edit button if it's editable", function() {
        otherBudgetView = new TGM.Views.OtherBudget({ editable: true, model: budget });
        otherBudgetView.render();

        expect(otherBudgetView.$el).toContain('a');
        expect(otherBudgetView.$('a')).toHaveAttr('href', '/budget/some-budget-id/edit');
    });

    it("should not be active when first rendered", function() {
        expect(otherBudgetView.$el).not.toHaveClass('active');
    });

    it("should activate when it's model is activated", function() {
        TGM.vent.trigger('activeBudget', budget);
        expect(otherBudgetView.$el).toHaveClass('active');
    });

});