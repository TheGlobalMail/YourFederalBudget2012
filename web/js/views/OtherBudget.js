TGM.Views.OtherBudget = Backbone.View.extend({

    template: _.template($("#other-budget-template").html()),
    className: 'other-budget',

    options: {
        editable: false
    },

    initialize: function()
    {
        _.bindAll(this);
        this.model.on('change', this.render);
    },

    render: function()
    {
        var data = this.model.toJSON();
        var c = new Date(data.createdAt);
        data.dateString = [c.getDate(), c.getMonth(), c.getFullYear()].join('/');
        data.editable = this.options.editable;

        if (!_.has(data, "_id")) {
            data._id = false;
        }

        var html = this.template(data);
        this.$el.html(html);

        if (this.$el.is(':visible')) { // already attached to dom
            this.doColorBar();
        }

        return this;
    },

    doColorBar: function()
    {
        var $colorBar = this.$('.color-bar');
        var totalWidth = $colorBar.width() - 2;
        var allocationSum = this.model.getTotal();
        var widthToAllocationRatio = totalWidth / allocationSum;

        $colorBar.html(''); // clear existing bar

        _.each(DATA.categories, function(cat, id) {
            var color = cat.color;
            var width = this.model.get(id) * widthToAllocationRatio;
            var bit = this._makeColorBarSection(id, width);

            $colorBar.append(bit);
        }, this);
    },

    _makeColorBarSection: function(id, width)
    {
        return $("<div/>").css({ width: width, float: "left", height: "100%" }).addClass(id).html('&nbsp;');
    }

});