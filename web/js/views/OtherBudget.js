TGM.Views.OtherBudget = Backbone.View.extend({

    template: _.template($("#other-budget-template").html()),
    className: 'other-budget',
    tagName: 'a',

    options: {
        editable: false
    },

    initialize: function()
    {
        if (this.options.editable) {
            // override el so we don't nest anchors
            this.setElement($("<div/>").addClass('other-budget'));
        }

        this.model.on('change', this.render, this);
        TGM.vent.on('activeBudget', this.onActiveBudget, this);
        TGM.vent.on('resized', this.doColorBar, this);
    },

    render: function()
    {
        var data = this.model.toJSON();
        var c = new Date(data.createdAt);
        data.dateString = [c.getDate(), c.getMonth()+1, c.getFullYear()].join('/');
        data.dateTime = c.toDateString();
        data.editable = this.options.editable;

        if (!_.has(data, "_id")) {
            data._id = false;
        }

        var html = this.template(data);
        this.$el.html(html);

        if (this.$el.parent()) { // already attached to dom
            this.doColorBar();
        }

        if (!this.options.editable) {
            this.$el.prop('href', '/budget/' + this.model.id);
        }

        return this;
    },

    doColorBar: function()
    {
        var $colorBar = this.$('.color-bar');
        var totalWidth = $colorBar.width() - 2;
        var allocationSum = this.model.getTotal();
        var widthToAllocationRatio = totalWidth / DATA.budgetAllowance;
        var unallocated = this._makeColorBarSection('unallocated', 'auto');

        unallocated.css('position', 'absolute');

        $colorBar.html(unallocated); // clear existing bar

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
    },

    onActiveBudget: function(activeBudget)
    {
        if (this.model.id == activeBudget.id) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }
    }

});