describe("BarGraphView", function() {
    // use slider max for easy comparison in bar height
    var $el = $("<div/>").css({ width: "100px", height: DATA.sliderConfig.max + "px" });
    var barGraphView;
    var budget1, budget2;

    beforeEach(function() {
        barGraphView = new TGM.Views.BarGraphView({ el: $el.clone() });
        barGraphView.defaults = {};

        _.each(DATA.categories, function(value, id) {
            barGraphView.defaults[id] = value.federalAllocation;
            // only inject defaults into this model so we don't mess with the others
            barGraphView.addCategory(id, value);
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

        barGraphView.addBudget("user", budget1);
        barGraphView.addBudget("federal", budget2);
    });


    it("should render a column for each category", function() {
        barGraphView.render();
        expect(barGraphView.$el.find('.category').length).toEqual(_.size(DATA.categories));
    });

    it("should render a bar in each column for each category", function() {
        barGraphView.render();
        expect(barGraphView.$el.find(".category:first .bar").length).toEqual(2); // budgets added
        expect(barGraphView.$el.find(".bar").length).toEqual(_.size(DATA.categories) * 2); // 2 budget per category
    });

    it("should render bars at the right height", function() {
        barGraphView.render();
        expect(barGraphView.$el.find("#bar-defense .user").height()).toEqual(budget1.get('defense'));
    });

    it("should update bar height when the model changes", function() {
        barGraphView.render();
        budget1.set('defense', 40);
        expect(barGraphView.$el.find("#bar-defense .user").height()).toEqual(budget1.get('defense'));
    });
});