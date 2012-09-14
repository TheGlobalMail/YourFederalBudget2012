describe("Category Allocation View", function() {
    var categoryAllocation, model, sampleData = {
        defense: 5.0,
        health: 5.2,
        immigration: 4.9,
        welfare: 4.0,
        taxBreaks: 2.0,
        agriculture: 3.0,
        education: 3.5,
        energy: 5.5
    };

    var $el = $([
        '<div>',
            '<div class="slider-control"></div>',
            '<div class="amount"></div>',
            '<div class="expander"></div>',
            '<div class="info-icon"></div>',
        '</div>'
    ].join(""));

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        categoryAllocation = new TGM.Views.CategoryAllocation({ model: model, el: $el.clone(), category: 'defense' });
        categoryAllocation.$el.appendTo('body');
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        categoryAllocation.$el.remove();
        this.clock.restore();
    });

    it("should active when collapsed", function() {
        categoryAllocation.collapse();
        this.clock.tick(500);

        expect(categoryAllocation.$el).not.toHaveClass('active');
    });

    it("should update the slider when the model changes", function() {
        model.set('defense', 30);
        expect(categoryAllocation.$slider.slider('value')).toEqual(30);
    });
});