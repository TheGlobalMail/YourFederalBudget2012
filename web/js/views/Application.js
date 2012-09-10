TGM.Views.Application = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').on('click', function(e) {
            e.preventDefault();
        });
    }

});