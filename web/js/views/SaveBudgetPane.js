TGM.Views.SaveBudgetPane = TGM.Views.SidePane.extend({

    events: {
        "submit form": "save",
        "reset form": "reset",
        "keyup input,textarea": "formUpdate",
        "change select": "formUpdate",
        "click .subscribe-wrapper input": "cacheIsSubscribeChecked"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.on('shown', this.onShow);

        // cache inputs
        this.$name        = this.$('.your-name-wrapper input');
        this.$state       = this.$('.your-name-wrapper select');
        this.$email       = this.$('.your-email-wrapper input');
        this.$description = this.$('.budget-description-wrapper textarea');
        this.$subscribe   = this.$('.subscribe-wrapper input');
        this.$saveButton  = this.$("#submit-save-budget");

        // update form when the model changes (normally from cache restore)
        this.model.on('change', this.modelChanged);

        // hide errors whenever the sidepane changes
        TGM.vent.on('showSidePane', this.clearErrors);

        TGM.vent.on('updateMode', this.refreshLabels);

        this.$subscribe.prop('checked', $.jStorage.get('isSubscribeChecked'));
    },

    cacheIsSubscribeChecked: function()
    {
        $.jStorage.set('isSubscribeChecked', this.$subscribe.is(':checked'));
    },

    onShow: function()
    {
        this.$('form input:first').focus();
    },

    save: function(e)
    {
        e.preventDefault();

        if (this.$saveButton.prop('disabled')) {
            return false;
        }

        this.$saveButton.prop('disabled', false);

        this.model.save(this.formToJson(), {
            success: this.success,
            error: this.error
        });
    },

    formToJson: function()
    {
        var json = {
            name: this.$name.val(),
            state: this.$state.val(),
            email: this.$email.val(),
            description: this.$description.val()
        }

        if (json.description.length > 500) {
            json.description = json.description.substr(0, 500);
            this.$description.val(json.description);
        }
    },

    reset: function(e)
    {
        e.preventDefault();
        window.history.back();
    },

    success: function(model, response)
    {
        if (this.$subscribe.is(':checked')) {
            $.post('/subscribe', { budgetId: model.id });
        }

        this.clearErrors();

        // clear the budget cache
        model.clearCache();

        // persist budget info in browser storage
        $.jStorage.set('clientId', model.get('clientId'));
        $.jStorage.set('budgetId', model.id);

        // prompt to share their budget
        TGM.vent.trigger('showSidePane', 'share-budget');
        this.$saveButton.prop('disabled', false);
    },

    error: function(model, response)
    {
        this.$saveButton.prop('disabled', false);

        if (response.status == 400) {
            var data = JSON.parse(response.responseText);
            var errors = _.extend({
                name: "",
                state: "",
                email: ""
            }, data.errors);

            this.showError(this.$name, errors.name);
            this.showError(this.$state, errors.state);
            this.showError(this.$email, errors.email);
        } else {
            alert('An error occured');
        }
    },

    showError: function($input, message)
    {
        var tooltip = $input.data('tooltip');

        // always hide tooltip
        if (tooltip) {
            tooltip.hide();
            $input.data('tooltip', null);
        }

        // show error if there's a message
        if (message) {
            if ($input[0] == this.$state[0]) {
                // someone is hacking the state field, let's laugh at them.
                window.location.replace('http://lmgtfy.com/?q=' + encodeURIComponent(this.$state.val()));
            }

            // create a close button for the tooltip
            var close = $('<a href="#" class="close">&times;</a>');
            // wrap message in HTML and append the close button
            message = $("<span/>").text(message).append(close);

            // create the tooltip
            var tooltip = new $.fn.tooltip.Constructor($input[0], { title: message, trigger: 'manual', placement: 'right' });

            // error state
            tooltip.tip().addClass('error');
            $input.addClass('error');

            // inject into data like the jQuery wrapper plugin does
            $input.data('tooltip', tooltip);

            // display
            tooltip.show();

            function closeTooltip() {
                tooltip.hide();
                $input.data('tooltip', null);
            }

            // close and remove the tooltip
            close.on('click', function(e) {
                e.preventDefault();
                closeTooltip();
                return false;
            });

            $input.on('blur', _.bind(this.showError, this, $input, false));
        } else if (($input[0] == this.$state[0] && !this.$name.hasClass('error')) || $input[0] != this.$state[0]) {
            $input.removeClass('error');
        }
    },

    clearErrors: function()
    {
        // clear error messages (empty messages closes)
        this.showError(this.$name, false);
        this.showError(this.$state, false);
        this.showError(this.$email, false);
    },

    formUpdate: function()
    {
        var json = this.formToJson();
        this.model.set(this.formToJson());
        this.model.cache();
    },

    modelChanged: function()
    {
        this.$name.val(this.model.get('name'));
        this.$state.val(this.model.get('state'));
        this.$email.val(this.model.get('email'));
        this.$description.val(this.model.get('description'));
    },

    refreshLabels: function()
    {
        this.$('h3').text('Save your changes');
    }

});