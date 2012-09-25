TGM.Views.BudgetInfo = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);
        this.$title = this.$('h1');
        this.$time  = this.$('time');
        this.$bottom = this.$('.bottom');

        TGM.vent.on('activeBudget', this.render);
        this.model.on('sync', this.render);
        this.render();
    },

    render: function(model)
    {
        if (model) {
            this.model = model;
        }

        if (this.model.get('clientId') || !this.model.id) {
            this.$title.text('Your budget');
            this.$bottom.css('opacity', 0);
        } else {
            this.$bottom.css('opacity', 100);
            var name = this.model.get('name');

            // better grammar for names ending with s
            if (name.substr(-1) == "s") {
                name += "' budget";
            } else {
                name += "'s budget";
            }

            this.$title.text(name);
        }
    }

});