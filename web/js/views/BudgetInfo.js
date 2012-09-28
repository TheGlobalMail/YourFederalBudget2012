TGM.Views.BudgetInfo = Backbone.View.extend({

    events: {
        "click .about": "toggleTooltip"
    },

    days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

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
        this.$('.about').data('tooltip', this.budgetDescriptionTooltip);
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
        this.budgetDescriptionTooltip && this.budgetDescriptionTooltip.hide();

        if (this.model.get('clientId') || !this.model.id) {
            this.$title.text('Your budget');
            this.$bottom.css('opacity', 0);
            this._timeout = setTimeout(_.bind(this.$bottom.hide, this.$bottom), 300);
            return this;
        }

        this._timeout && clearTimeout(this._timeout);
        // update title
        this.$bottom.show();
        this.$bottom.css('opacity', 100);
        var title = this.model.get('name');

        // better grammar for names ending with s
        if (title.substr(-1) == "s") {
            title += "' budget";
        } else {
            title += "'s budget";
        }

        this.$title.text(title);
        this.$time.html(this.timestampToString(this.model.get('createdAt')));

        // update description
        this.$description.text(this.model.get('description'));
        this.$name.text(this.model.get('name'));
        this.$state.text(this.model.get('state'));

        this.budgetDescriptionTooltip.options.title = $('<div/>').html(this.$tooltipWrap.html());
    },

    timestampToString: function(timestamp)
    {
        var date = new Date(timestamp);
        var dateString = this.days[date.getDay()] + " " + date.getDate();

        if (dateString.substr(-2, 1) == '1') {
            dateString += '<super>th</super>'
        } else {
            switch (dateString.substr(-1)) { // last number in the date
                case '1':
                    dateString += '<super>st</super>';
                break;

                case '2':
                    dateString += '<super>nd</super>';
                break;

                case '3':
                    dateString += '<super>rd</super>';
                break;

                default:
                    dateString += '<super>th</super>';
                break;
            }
        }

        dateString += " " + this.months[date.getMonth()] + ", " + date.getFullYear();

        return dateString;
    }

});