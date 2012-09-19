TGM.Views.Application = Backbone.View.extend({

    events: {
        "click .email-page-link": "showEmailModal",
        "click #at16ptx": "doNothing"
    },

    initialize: function()
    {
        _.bindAll(this);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').attr('data-bypass', true);

        this.emailPage = new TGM.Views.EmailPage({ el: this.$("#email-page-form") });
    },

    showEmailModal: function()
    {
        this.emailPage.show();
    },

    doNothing: function(event)
    {
        event.preventDefault && event.preventDefault();
        return false;
    },

    hideAppLoadingOverlay: function()
    {
        this.$("#app-loading").fadeOut('fast');
    }

});