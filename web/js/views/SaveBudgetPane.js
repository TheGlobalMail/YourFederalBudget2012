TGM.Views.SaveBudgetPane = TGM.Views.SidePane.extend({

    events: {
        "submit form": "save",
        "reset form": "reset"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.on('shown', this.onShow);
        this.$name = this.$('.your-name-wrapper input');
        this.$state = this.$('.your-name-wrapper select');
        this.$email = this.$('.your-email-wrapper input');
        this.$description = this.$('.budget-description-wrapper textarea');
    },

    onShow: function()
    {
        this.$('form input:first').focus();
    },

    save: function(e)
    {
        event.preventDefault();

        var data = {
            name: this.$name.val(),
            state: this.$state.val(),
            email: this.$email.val(),
            description: this.$description.val()
        };

        this.model.save(data, {
            success: this.success,
            error: this.error
        });
    },

    reset: function(e)
    {
        e.preventDefault();
        window.history.back();
    },

    success: function(model, response)
    {
        model.set('clientId', response.clientId);
        $.jStorage.set('clientId', response.clientId);
        $.jStorage.set('budgetId', response.success._id);
    },

    error: function(model, response)
    {
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
        if (tooltip) {
            tooltip.hide();
            $input.data('tooltip', null);
        }

        if (message) {
            if ($input[0] == this.$state[0]) {
                // someone is hacking the state field, let's laugh at them.
                window.location.replace('http://lmgtfy.com/?q=' + encodeURIComponent(this.$state.val()));
            }

            // add close button to message
            var close = $('<a href="#" class="close">&times;</a>').clone();
            message = $("<span/>").text(message).append(close);

            $input.addClass('error');
            var tooltip = new $.fn.tooltip.Constructor($input[0], { title: message, trigger: 'manual', placement: 'right' });
            tooltip.tip().addClass('error');
            $input.data('tooltip', tooltip);
            tooltip.show();

            close.on('click', function(e) {
                e.preventDefault();
                tooltip.hide();
                $input.data('tooltip', null);
            });
        } else if (($input[0] == this.$state[0] && !this.$name.hasClass('error')) || $input[0] != this.$state[0]) {
            $input.removeClass('error');
        }
    }

});