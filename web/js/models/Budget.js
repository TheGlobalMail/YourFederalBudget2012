TGM.Models.Budget = Backbone.Model.extend({

    // automatically injected in main.js
    defaults: {
        name: "",
        state: "",
        createdAt: 0 // milliseconds since epoch
    },

    urlRoot: '/api/budget/',

    idAttribute: "_id",

    set: function(attribute, value, options)
    {
        var attrs, attr;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(attribute) || attribute == null) {
            attrs = attribute;
            options = value;
        } else {
            attrs = {};
            attrs[attribute] = value;
        }

        // process amount if setting category value
        _.each(attrs, function(val, key) {
            if (key in DATA.categories) {
                val = parseFloat(val);

                // not a number, reset to original value
                if (_.isNaN(val)) {
                    attrs[key] = this.get(key);
                    return;
                }

                val = Math.round(val);

                // make sure value is in the slider range
                val = Math.max(DATA.sliderConfig.min, val);
                val = Math.min(DATA.sliderConfig.max, val);

                // cap input so value doesn't go over the max budget allowance
                if (this.getTotal() - (this.get(key) - val) > DATA.budgetAllowance) {
                    val = DATA.budgetAllowance - (this.getTotal() - this.get(key));
                }

                attrs[key] = val;
            }
        }, this);

        return Backbone.Model.prototype.set.call(this, attrs, null, options);
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
    },

    resetBudget: function()
    {
        _.each(this.defaults, function(amount, category) {
            if (category in DATA.categories) {
                this.set(category, amount);
            }
        }, this);

        this.trigger('reset');
    },

    getUrl: function()
    {
        return window.location.origin + "/budget/" + this.id;
    }

});