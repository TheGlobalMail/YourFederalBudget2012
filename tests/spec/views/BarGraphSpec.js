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
            defense: 50,
            health: 52,
            immigration: 49,
            welfare: 40,
            taxBreaks: 20,
            agriculture: 30,
            education: 35,
            energy: 55
        });

        budget2 = new TGM.Models.Budget({
            defense: 40,
            health: 42,
            immigration: 39,
            welfare: 30,
            taxBreaks: 10,
            agriculture: 20,
            education: 25,
            energy: 45
        });

        barGraph.addBudget("user", budget1);
        barGraph.addBudget("federal", budget2);
    });

    describe("Bars", function() {
        it("should render a column for each category", function() {
            barGraph.render();
            expect(barGraph.$el.find('.category').length).toEqual(_.size(DATA.categories));
        });

        it("should render a bar in each column for each category", function() {
            barGraph.render();
            expect(barGraph.$el.find(".category:first .bar").length).toEqual(2); // budgets added
            expect(barGraph.$el.find(".bar").length).toEqual(_.size(DATA.categories) * 2); // 2 budget per category
        });

        it("should render bars at the right height", function() {
            barGraph.render();
            expect(barGraph.$el.find("#bar-defense .user").height()).toEqual(budget1.get('defense'));
        });

        it("should update bar height when the model changes", function() {
            barGraph.render();
            budget1.set('defense', 40);
            expect(barGraph.$el.find("#bar-defense .user").height()).toEqual(budget1.get('defense'));
        });
    });

});