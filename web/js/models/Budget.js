TGM.Models.Budget = Backbone.Model.extend({

    // automatically injected in main.js
    defaults: {},

    set: function(attribute, value, options)
    {
        if (attribute in DATA.categories) {
            value = parseInt(value, 10);

            // not a number, reset to original value
            if (_.isNaN(value)) {
                value = this.get(attribute);
            }

            // make sure value is in the slider range
            value = Math.max(DATA.sliderConfig.min, value);
            value = Math.min(DATA.sliderConfig.max, value);

            // cap input so value doesn't go over the max budget allowance
            if (this.getTotal() - this.get(attribute) + value > DATA.budgetAllowance) {
                value = DATA.budgetAllowance - this.getTotal() + this.get(attribute);
            }
        }

        return Backbone.Model.prototype.set.call(this, attribute, value, options);
    },

    getTotal: function()
    {
        var values = this.attributes;
        var total = 0;

        _.each(values, function(value, category) {
            if (category in DATA.categories) {
                total += value;
            }
        });

        return total;
    }

});