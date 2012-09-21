TGM.Collections.Budgets = Backbone.Collection.extend({

    url: '/api/budget/list',
    model: TGM.Models.Budget,
    timesFetched: 0,
    resultsPerFetch: 10,
    full: false,

    initialize: function()
    {
        _.bindAll(this);
        this.on('reset', this.onReset);
    },

    onReset: function()
    {
        this.timesFetched = 0;
    },

    fetchMore: function(error, success)
    {
        if (this.full || this.fetching) {
            return false;
        }

        this.fetching = true;
        this.trigger('fetching');
        error = error || function() {};

        var _success = _.bind(function(collection, response) {
            // empty responses means there's no more budgets to fetch (they're all in memory now)
            if (!_.size(response)) {
                this.full = true;
                this.trigger('full', collection);
                return false;
            }

            this.timesFetched += 1;
            this.trigger('fetched', collection, response);

            if (_.isFunction(success)) {
                success(collection, response);
            }

            this.fetching = false;
        }, this);

        var start = this.timesFetched * this.resultsPerFetch;
        var count = this.resultsPerFetch;

        return this.fetch({
            add: true,
            success: _success,
            error: error,
            data: {
                start: start,
                count: count
            }
        });
    },

    getLastFetched: function()
    {
        return this.last(this.resultsPerFetch)
    }

});