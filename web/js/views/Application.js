TGM.Views.Application = Backbone.View.extend({

    events: {
        "click .email-page-link": "showEmailModal",
        "click #at16ptx": "doNothing",
        "click .googleplusone": "shareOnGooglePlus"
    },

    initialize: function()
    {
        _.bindAll(this, 'onResize', 'showEmailModal', 'hideAppLoadingOverlay');
        this.$window = $(window);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').attr('data-bypass', true);

        this.emailPage = new TGM.Views.EmailPage({ el: this.$("#email-page-form") });
        this.$window.on('resize', this.onResize);
        this.currentSize = this._calculateCurrentSize();

        this.$introModal = this.$("#intro-modal");
    },

    shareOnGooglePlus: function(e)
    {
        e.preventDefault();
        var url = $(e.currentTarget).parents('.addthis_toolbox').attr('addthis:url');
        var popUp = window.open('https://plus.google.com/share?url=' + url, 'popupwindow', 'scrollbars=yes,width=800,height=400');
        popUp.focus();
        return false;
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
        if (!$.jStorage.get('introModal')) {
            this.$introModal.modal('show');
            this.$introModal.on('hide', function() {
                TGM.vent.publish('introClosed');
                $.jStorage.set('introModal', true);
            });
        } else {
            TGM.vent.publish('introClosed');
        }
        window.addthis && window.addthis.init();
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