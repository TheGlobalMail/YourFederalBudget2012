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
        this.$aboutLink   = this.$('.about');

        this.budgetDescriptionTooltip = new $.fn.tooltip.Constructor(this.$aboutLink[0], {
            placement: 'bottom',
            trigger: 'manual'
        });

        this.budgetDescriptionTooltip.getPosition = function (inside) {
            var offset = this.$element.offset();
            offset.left += 108;

            return $.extend({}, (inside ? {top: 0, left: 0} : offset), {
                width: this.$element[0].offsetWidth,
                height: this.$element[0].offsetHeight
            })
        }

        this.$('.about').data('tooltip', this.budgetDescriptionTooltip);
        this.budgetDescriptionTooltip.tip().addClass('budget-description-tooltip');

        TGM.vent.on('activeBudget', this.render);
        this.model.on('sync change:description', this.render);
        this.render();
    },

    toggleTooltip: function()
    {
        this.budgetDescriptionTooltip.toggle();
        this.bindClose();
    },

    bindClose: function()
    {
        this.budgetDescriptionTooltip.tip().on('click', _.bind(function(e) {
            e.preventDefault();
            this.budgetDescriptionTooltip.hide();
            return false;
        }, this));
    },

    render: function(model)
    {
        this.model = model || this.model;

        if (this.model.get('clientId') || this.model.isNew()) {
            this.$title.text('Your budget');
        } else {
            var title = this.model.get('name');

            // better grammar for names ending with s
            if (title.substr(-1) == "s") {
                title += "' budget";
            } else {
                title += "'s budget";
            }

            this.$title.text(title);
        }

        if (this.model.isNew()) {
            this.$bottom.css('opacity', 0);
            this._timeout = setTimeout(_.bind(this.$bottom.hide, this.$bottom), 300);
            this.budgetDescriptionTooltip && this.budgetDescriptionTooltip.hide();
        } else {
            this.$bottom.show();
            this.$bottom.css('opacity', 100);
            this._timeout && clearTimeout(this._timeout);
        }

        if (this.model.get('description')) {
            this.$aboutLink.show();
        } else {
            this.$aboutLink.hide();
            this.budgetDescriptionTooltip && this.budgetDescriptionTooltip.hide();
        }

        this.$time.html(this.timestampToString(this.model.get('createdAt')));

        // update description
        this.$description.html("&ldquo;" + this.model.get('description') + "&rdquo;");
        this.$name.text(this.model.get('name'));
        this.$state.text(DATA.states[this.model.get('state')]);

        this.budgetDescriptionTooltip.options.title = $('<div/>').html(this.$tooltipWrap.html());
        this.model.get('description') && !this.model.get('clientId') && this.budgetDescriptionTooltip.show();
        this.bindClose();
    },

    timestampToString: function(timestamp)
    {
        var date = new Date(timestamp);
        var dateString = "Created " + this.days[date.getDay()] + " " + date.getDate();

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