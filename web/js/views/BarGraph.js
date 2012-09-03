TGM.Views.BarGraph = Backbone.View.extend({

    categories: {},
    budgets: {},

    initialize: function()
    {
        _.bindAll(this);
    },

    addCategory: function(id, category)
    {
        this.categories[id] = category;
    },

    addBudget: function(id, budget)
    {
        this.budgets[id] = budget;
    },

    _renderCategory: function(category, id)
    {
        var html = $('<div class="category"/>');
        html.prop('id', 'bar-' + id).addClass(id);

        var budgetsCount = 0;
        var barWidth = (100 / _.size(this.budgets));

        _.each(this.budgets, function(budget, bid) {
            var bh = $('<div class="bar"/>');
            bh.addClass(bid);
            bh.css({
                height: this.calculateBarHeight(budget.get(id)),
                backgroundColor: DATA.budgetColours[bid],
                width: barWidth + "%",
                left: (barWidth * budgetsCount) + "%"
            });
            bh.appendTo(html);

            budget.on('change:' + id, function(model, value, options) {
                bh.css('height', this.calculateBarHeight(value));
            }, this);

            budgetsCount += 1;
        }, this);

        html.css({
            left: (this.calculateCategoryOffset(this._renderedCategories)),
            height: '100%',
            backgroundColor: '#eee',
            width: '10%'
        });

        html.appendTo(this.$el);
        this._renderedCategories += 1;
    },

    calculateCategoryOffset: function(count)
    {
        var width = this.$el.width() / _.size(this.categories);

        return (width * (count - 1)) + 'px';
    },

    calculateBarHeight: function(amount)
    {
        var percantageOfMax = amount / DATA.sliderConfig.max;
        var height = percantageOfMax * this.$el.height();

        return height + 'px';
    },

    render: function()
    {
        this._renderedCategories = 1;
        _.each(this.categories, this._renderCategory);
    }

});