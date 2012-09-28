TGM.Views.BudgetInfo = Backbone.View.extend({

    events: {
        "click .about": "toggleTooltip"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.$title       = this.$('h1');
        this.$time        = this.$('time');
        this.$bottom      = this.$('.bottom');
        this.$description = this.$('.budget-description');
        this.$name        = this.$('.budget-name');
        this.$state       = this.$('.budget-state');
        this.$tooltipWrap = this.$('.budget-description-tooltip');

        TGM.vent.on('activeBudget', this.render);
        this.model.on('sync', this.render);
        this.render();

        this.budgetDescriptionTooltip = new $.fn.tooltip.Constructor(this.$('.about')[0], {
            placement: 'bottom',
            trigger: 'manual'
        });

        this.budgetDescriptionTooltip.tip().addClass('budget-description-tooltip');
    },

    toggleTooltip: function()
    {
        this.budgetDescriptionTooltip.toggle();

        this.budgetDescriptionTooltip.options.title.find('.close').on('click', _.bind(function(e) {
            e.preventDefault();
            this.budgetDescriptionTooltip.hide();
            return false;
        }, this));
    },

    render: function(model)
    {
        this.model = model || this.model;

        if (this.model.get('clientId') || !this.model.id) {
            this.$title.text('Your budget');
            this.$bottom.css('opacity', 0);
            return this;
        }

        // update title
        this.$bottom.css('opacity', 100);
        var title = this.model.get('name');

        // better grammar for names ending with s
        if (title.substr(-1) == "s") {
            title += "' budget";
        } else {
            title += "'s budget";
        }

        this.$title.text(title);

        // update description
        this.$description.text(this.model.get('description'));
        this.$name.text(this.model.get('name'));
        this.$state.text(this.model.get('state'));

        this.budgetDescriptionTooltip.options.title = $('<div/>').html(this.$tooltipWrap.html());
    }

});