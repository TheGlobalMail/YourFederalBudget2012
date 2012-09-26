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
            '<div class="slider-amount"></div>',
            '<div class="expander"></div>',
            '<div class="info-icon"></div>',
        '</div>'
    ].join(""));

    beforeEach(function() {
        model = new TGM.Models.Budget(sampleData);
        categoryAllocation = new TGM.Views.CategoryAllocation({ model: model, el: $el.clone(), category: 'defense' });
        categoryAllocation.$el.appendTo('body');
    });

    afterEach(function() {
        categoryAllocation.$el.remove();
    });

    it("should deactivate when collapsed", function() {
        categoryAllocation.collapse();

        expect(categoryAllocation.$el).not.toHaveClass('active');
    });

    it("should activate when expanded", function() {
        categoryAllocation.expand();

        expect(categoryAllocation.$el).toHaveClass('active');
    });

    it("should update the slider when the model changes", function() {
        model.set('defense', 30);
        expect(categoryAllocation.$slider.slider('value')).toEqual(30);
        expect(categoryAllocation.$sliderAmount).toHaveText('$30.0b');
    });

    it("should switch to income based amounts when pretax income is calculated", function() {
        model.pretaxIncomeAmounts['defense'] = 213.34;
        categoryAllocation.currentBudgetMode = 'your-pretax-income';
        categoryAllocation.refreshAmount(model);

        expect(categoryAllocation.$sliderAmount).toHaveText('$213.34');
    });

    it("should switch back to federal spending amounts when that budget mode is selected again", function() {
        categoryAllocation.currentBudgetMode = 'your-pretax-income';
        categoryAllocation.refreshAmount(model);

        categoryAllocation.currentBudgetMode = 'federal-spending';
        categoryAllocation.refreshAmount(model);

        expect(categoryAllocation.$sliderAmount).toHaveText('$5.0b');
    });

    it("should refresh the slider amount when the budget mode is switched", function() {
        var spy = sinon.spy(categoryAllocation, "refreshAmount");

        categoryAllocation.budgetModeChanged('your-pretax-income');
        expect(spy).toHaveBeenCalled();

        categoryAllocation.refreshAmount.restore();
    });
});