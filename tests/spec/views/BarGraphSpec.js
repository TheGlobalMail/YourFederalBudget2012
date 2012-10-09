describe("Bar Graph Visualisation", function() {
    // use slider max for easy comparison in bar height
    var $el = $("<div/>").css({ width: "100px", height: DATA.sliderConfig.max + "px" });
    var barGraph;
    var budget1, budget2;

    beforeEach(function() {
        barGraph = new TGM.Views.BarGraph({ el: $el.clone() });
        barGraph.defaults = {};

        _.each(DATA.categories, function(value, id) {
            barGraph.defaults[id] = value.federalAllocation;
            // only inject defaults into this model so we don't mess with the others
            barGraph.addCategory(id, value);
        });

        budget1 = new TGM.Models.Budget({
            defense: 5.0,
            health: 5.2,
            immigration: 4.9,
            welfare: 4.0,
            taxBreaks: 2.0,
            agriculture: 3.0,
            education: 3.5,
            energy: 5.5
        });

        budget2 = new TGM.Models.Budget({
            defense: 4.0,
            health: 4.2,
            immigration: 3.9,
            welfare: 3.0,
            taxBreaks: 1.0,
            agriculture: 2.0,
            education: 2.5,
            energy: 4.5
        });

        barGraph.addBudget("user", budget1);
        barGraph.addBudget("federal", budget2);
    });

    describe("Bars", function() {
        it("should render a column for each category", function() {
            barGraph.render();
            expect(barGraph.$('.category').length).toEqual(_.size(DATA.categories));
        });

        it("should render a bar in each column for each category", function() {
            barGraph.render();
            expect(barGraph.$(".category:first .bar").length).toEqual(2); // budgets added
            expect(barGraph.$(".bar").length).toEqual(_.size(DATA.categories) * 2); // 2 budget per category
        });

        it("should render bars at the right height", function() {
            barGraph.render();
            expect(barGraph.$("#bar-defense .user").height()).toEqual(budget1.get('defense'));
        });

        it("should update bar height when the model changes", function() {
            barGraph.render();
            budget1.set('defense', 40);
            expect(barGraph.$("#bar-defense .user").height()).toEqual(budget1.get('defense'));
        });

        it("should active the category when it's column/bars are click", function() {
            var spy = sinon.spy();
            TGM.vent.on('BudgetAllocatorCategory:expanding', spy);
            barGraph.render();
            barGraph.$('.category:first-child').trigger('click');
            expect(spy).toHaveBeenCalledWith('defense');
        });
    });

});