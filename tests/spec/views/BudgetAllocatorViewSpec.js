describe("Budget Allocator View", function() {
    var budgetAllocatorView, model, sampleData = {
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
        budgetAllocatorView = new TGM.Views.BudgetAllocatorView({ model: model, el: $el.clone() });
        budgetAllocatorView.$el.appendTo('body');
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        budgetAllocatorView.$el.remove();
        this.clock.restore();
    });

    it("should show the first category slider", function() {
        var first = budgetAllocatorView.$('.category:first');
        expect(first.find('.expander')).toBeVisible();
        expect(first).toHaveClass('visible');
    });

    it("should hide all other categories", function() {
        var rest = budgetAllocatorView.$('.category').not(':first');
        expect(rest.find('.expander')).toBeHidden();
        expect(rest).not.toHaveClass('visible');
    });

    it("should collapse the first category when we switch active category", function() {
        TGM.vent.trigger("BudgetAllocatorCategory:expanding", "health");
        // let animation run
        this.clock.tick(1000);

        var first = budgetAllocatorView.$('.category:first');
        expect(first.find('.expander')).toBeHidden();
        expect(first).not.toHaveClass('visible');
    });
});