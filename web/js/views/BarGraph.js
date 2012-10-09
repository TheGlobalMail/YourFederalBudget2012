TGM.Views.BarGraph = Backbone.View.extend({

    categories: {},
    budgets: {},

    initialize: function()
    {
        _.bindAll(this);
        TGM.vent.on('resized', this.onResize);
        TGM.vent.on('activeBudget', this.budgetSwap);
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
        var $category = $('<div class="category"/>');
        $category.prop('id', 'bar-' + id).addClass(id);
        $category.on('click', function() {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', id);
        });
        var barsWidth = 0;

        _.each(this.budgets, function(budget, bid) {
            var $bar = $('<div class="bar"/>').addClass(bid);
            var color = TGM.Color(DATA.categories[id].color).blend(TGM.Color('#fff'), DATA.barGraph[bid].lightenBy);
            var barWidth = DATA.barGraph[bid].width;

            $bar.css({
                height: this.calculateBarHeight(budget.get(id)),
                backgroundColor: color.toCSS(),
                width: barWidth + "%",
                left: (barsWidth) + "%"
            }).appendTo($category);

            barsWidth += barWidth + 2;

            budget.on('change:' + id, function(model, value, options) {
                $bar.css('height', this.calculateBarHeight(value));
            }, this);
        }, this);

        $category.css({
            left: (this.calculateCategoryOffset(this._renderedCategories)),
            height: '100%',
            width: '10%'
        });

        $category.appendTo(this.$el);
        this._renderedCategories += 1;
    },

    updateUserBar: function(category, id)
    {
        var $bar = this.$('#bar-' + id + ' .bar.user');
        $bar.css('height', this.calculateBarHeight(this.budgets['user'].get(id)));
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
        this.$el.html('');
        this._renderedCategories = 1;
        _.each(this.categories, this._renderCategory);
        this.renderedWidth = this.$el.width();
    },

    reRender: function()
    {
        if (this._renderedCategories <= 1) {
            return this.render();
        }

        _.each(this.categories, this.updateUserBar);
    },

    onResize: function()
    {
        if (this.$el.width() != this.$el.renderedWidth) {
            this.render();
        }
    },

    budgetSwap: function(newActiveBudget)
    {
        this.budgets['user'] = newActiveBudget;
        this.reRender();
    }

});