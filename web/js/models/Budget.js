TGM.Models.Budget = Backbone.Model.extend({

    // some are injected in main.js
    defaults: {
        name: "",
        state: "",
        createdAt: 0 // milliseconds since epoch
    },

    urlRoot: '/api/budget/',
    idAttribute: "_id",

    initialize: function()
    {
        this.pretaxIncomeAmounts = {};
        this.on('change', this.recalculatePretaxIncomeAmounts, this);
    },

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

                // make sure value is in the slider range
                val = Math.max(DATA.sliderConfig.min, val);
                val = Math.min(DATA.sliderConfig.max, val);

                // cap input so value doesn't go over the max budget allowance
                if (this.getTotal() - (this.get(key) - val) > DATA.budgetAllowance) {
                    val = DATA.budgetAllowance - (this.getTotal() - this.get(key));
                }

                val = Math.round(val * 10) / 10;
                attrs[key] = val;
            }
        }, this);

        if (this.getTotal() == DATA.budgetAllowance && !this.budgetFullyAllocated) {
            this.budgetFullyAllocated = true;
            TGM.vent.trigger('budgetFullyAllocated', true);
        } else if (this.budgetFullyAllocated && this.getTotal() < DATA.budgetAllowance) {
            this.budgetFullyAllocated = false;
            TGM.vent.trigger('budgetFullyAllocated', false);
        }

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

        return Math.round(total * 10) / 10;
    },

    resetBudget: function()
    {
        if (this.resetState) {
            this.set(this.resetState);
        } else {
            _.each(this.defaults, function(amount, category) {
                if (category in DATA.categories) {
                    this.set(category, amount);
                }
            }, this);
        }

        this.clearCache();
        this.trigger('reset');
    },

    getUrl: function()
    {
        return window.location.origin + "/budget/" + this.id;
    },

    tryCaching: function()
    {
        $.jStorage.set('userBudget', this.toJSON());
    },

    tryRestoreFromCache: function()
    {
        var cached = $.jStorage.get('userBudget');
        this.resetState = this.toJSON();

        if (cached) {
            this.set(cached);
            return true;
        }

        return false;
    },

    clearCache: function()
    {
        $.jStorage.deleteKey('userBudget');
        this.resetState = this.toJSON();
    },

    calculatePretaxIncomeAmounts: function(pretaxIncome)
    {
        this.taxPaid = this.calculateTaxPaidOnIncome(pretaxIncome);

        _.each(DATA.categories, function(category, id) {
            var categoryAsPercentage = this.get(id) / DATA.budgetAllowance;
            this.pretaxIncomeAmounts[id] = Math.round((categoryAsPercentage * this.taxPaid) * 10) / 10;
        }, this);
    },

    recalculatePretaxIncomeAmounts: function()
    {
        _.each(DATA.categories, function(category, id) {
            var categoryAsPercentage = this.get(id) / DATA.budgetAllowance;
            this.pretaxIncomeAmounts[id] = Math.round((categoryAsPercentage * this.taxPaid) * 10) / 10;
        }, this);
    },

    calculateTaxPaidOnIncome: function(pretaxIncome)
    {
        return pretaxIncome / 3;
    },

    getIncomeBasedAmount: function(key)
    {
        return this.pretaxIncomeAmounts ? this.pretaxIncomeAmounts[key] : this.get.apply(this, arguments);
    },

    getIncomeBasedTotal: function()
    {
        var values = this.pretaxIncomeAmounts;
        var total = 0;

        _.each(values, function(value, category) {
            if (category in DATA.categories && value) {
                total += value;
            }
        });

        return total;
    }

});