describe("Category Allocation View", function() {
    var categoryAllocation, model, sampleData = {
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

    it("should be entirely visible when constructed", function() {
        expect(categoryAllocation.$expander).toBeVisible();
    });

    it("should hide the slider when collapsed", function() {
        categoryAllocation.collapse();
        this.clock.tick(500);

        expect(categoryAllocation.$expander).toBeHidden();
        expect(categoryAllocation.$el).not.toHaveClass('visible');
    });

    it("should update the slider when the model changes", function() {
        model.set('defense', 30);
        expect(categoryAllocation.$slider.slider('value')).toEqual(30);
    });

    it("should update the manual input field when the model changes", function() {
        model.set('defense', 30);
        expect(categoryAllocation.$amount).toHaveValue('30');
    });

    it("should update the model when on manual value entry", function() {

    });
});