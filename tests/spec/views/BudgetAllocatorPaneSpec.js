describe("Budget Allocator View", function() {
    var budgetAllocator, model, sampleData = {
        defense: 50,
        health: 52,
        immigration: 49,
        welfare: 40,
        taxBreaks: 20,
        agriculture: 30,
        education: 35,
        energy: 55
    };


    var $el = $([
        '<div>',
            '<div class="category" data-id="defense">',
                '<div class="expander"></div>',
            '</div>',
            '<div class="category" data-id="health">',
                '<div class="expander"></div>',
            '</div>',
            '<div class="category" data-id="education">',
                '<div class="expander"></div>',
            '</div>',
        '</div>'
    ].join("\n"));

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        budgetAllocator = new TGM.Views.BudgetAllocatorPane({ model: model, el: $el.clone() });
        budgetAllocator.$el.appendTo('body');
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        budgetAllocator.$el.remove();
        this.clock.restore();
    });

    it("should actived the first slider box", function() {
        var first = budgetAllocator.$('.category:first');
        expect(first).toHaveClass('active');
    });

    it("shouldn't active other categories", function() {
        var rest = budgetAllocator.$('.category').not(':first');
        expect(rest).not.toHaveClass('active');
    });

    it("should deactivate the first category when we switch active category", function() {
        TGM.vent.trigger("BudgetAllocatorCategory:expanding", "health");
        // let animation run
        this.clock.tick(1000);

        var first = budgetAllocator.$('.category:first');
        expect(first).not.toHaveClass('active');
    });

    it("should hide tooltips on child views when it's been hidden", function() {
        var budgetOverviewMock = sinon.mock(budgetAllocator.budgetOverview);
        budgetOverviewMock.expects("closeBudgetFullyAllocatedTooltip").once();

        var budgetModeTogglerMock = sinon.mock(budgetAllocator.budgetModeToggler);
        budgetModeTogglerMock.expects('closeTooltips').once();

        budgetAllocator.onHidden();

        budgetOverviewMock.verify();
        budgetModeTogglerMock.verify();
    });
});