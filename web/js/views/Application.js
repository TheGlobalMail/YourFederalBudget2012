TGM.Views.Application = Backbone.View.extend({

    events: {
        "click .email-page-link": "showEmailModal",
        "click #at16ptx": "doNothing"
    },

    initialize: function()
    {
        _.bindAll(this, 'onResize', 'showEmailModal');
        this.$window = $(window);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').attr('data-bypass', true);

        this.emailPage = new TGM.Views.EmailPage({ el: this.$("#email-page-form") });
        this.$window.on('resize', this.onResize);
        this.currentSize = this._calculateCurrentSize();
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
    },

    _calculateCurrentSize: function()
    {
        var h = this.$window.height(), w = this.$window.width();

        if (w < 1060) {
            return 'small';
        }

        if (w < 1260 || h < 805) {
            return 'medium';
        }

        return 'large';
    },

    onResize: function(e)
    {
        var newSize = this._calculateCurrentSize();

        if (newSize != this.currentSize) {
            this.currentSize = newSize;
            TGM.vent.trigger('resized', newSize);
        }
    }

});