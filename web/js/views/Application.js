TGM.Views.Application = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').attr('data-bypass', true);
    }

});