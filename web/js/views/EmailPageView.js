TGM.Views.EmailPageView = Backbone.View.extend({

    events: {
        "shown": "onShow",
        "hidden": "onClose",
        "click .add-another-to-email": "addToEmailField",
        "submit form": "onFormSubmit"
    },

    initialize: function()
    {
        _.bindAll(this);
        $('.email-page-link').on('click', this.show);
        this.$toEmailFields = this.$('.to-email-fields');
        this.$form = this.$('form');
        this.$toEmailField = this.$toEmailFields.children('div:first').clone();
    },

    addToEmailField: function()
    {
        // clone first input and append
        var firstField = this.$toEmailField.clone();
        firstField.find('input').val('');
        this.$toEmailFields.append(firstField);
    },

    show: function(event)
    {
        if (event) {
            event.preventDefault();
            // hide popover
            $(event.target).parents('.popover').hide();
        }

        this.$el.modal('show');
    },

    hide: function()
    {
        this.$el.modal('hide');
    },

    onShow: function()
    {
        $('body').css('overflow', 'hidden');
    },

    onClose: function()
    {
        $('body').css('overflow', 'auto');
    },

    toggleSending: function()
    {
        var $submit = this.$('[type="submit"]');

        if (!$submit.prop('disabled')) {
            $submit.data('original-text', $submit.html())
                   .html('Sending...')
                   .prop('disabled', true);
        } else {
            $submit.html($submit.data('original-text'))
                   .data('original-text', '')
                   .prop('disabled', false);
        }
    },

    onFormSubmit: function(event)
    {
        event.preventDefault();
        this.toggleSending(true);

        var data = {
            "yourName": this.$('[name="your-name"]').val(),
            "yourEmail": this.$('[name="your-email"]').val(),
            toEmails: []
        };

        _.each(this.$('.to-email'), function(el) {
            data.toEmails.push(el.value);
        });

        $.ajax({
            url: "/email-page",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data, textStatus, jqXHR) {
                console.log(arguments);
            },
            error: _.debounce(this.showErrors, 700)
        });
    },

    showErrors: function(jqXHR)
    {
        var data = _.extend({
            yourName: "",
            yourEmail: "",
            toEmails: ""
        }, JSON.parse(jqXHR.responseText));

        this.showError(this.$('.your-name-wrapper'), data.yourName);
        this.showError(this.$('.your-email-wrapper'), data.yourEmail);

        if (_.isString(data.toEmails) && data.toEmails.length) {
            this.showError(this.$toEmailFields.find('.control-group:first'), data.toEmails);
        }

        this.toggleSending();
    },

    showError: function($controlGroup, message)
    {
        $controlGroup.removeClass('error');
        var $help = $controlGroup.find('[class*="help"]');

        if (message) {
            var doShake = !!$help.html().length;

            $controlGroup.addClass('error');

            if (doShake) {
                $help.effect('shake', { times: 3, distance: 5 }, 80);
            }
        }

        $help.html(message);
    }

});