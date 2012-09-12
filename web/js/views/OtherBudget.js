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

        return this;
    }

});