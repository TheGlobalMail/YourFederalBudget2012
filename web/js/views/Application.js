TGM.Views.Application = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);

        this.$('.popover-link').arrowPopover({
            actionToActivatePopover: 'click'
        });

        this.$('.addthis_toolbox a').attr('data-bypass', true);
        this.$el.on('click', '#at16ptx', function(e) { e.preventDefault(); return false; });
    }

});