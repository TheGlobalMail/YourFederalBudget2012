TGM.Views.ShareBudgetPane = TGM.Views.SidePane.extend({

    events: {
        "focus .budget-url": "onBudgetUrlFocus",
        "mouseup .budget-url": "onBudgetUrlMouseUp",
        "click .return-to-allocator": "showBudgetAllocator"
    },

    initialize: function()
    {
        _.bindAll(this);

        this.$budgetName = this.$('.budget-name');
        this.$budgetUrl  = this.$('.budget-url');
        this.$shareButtons = this.$('.share-buttons');

        this.clip = new ZeroClipboard.Client();
        this.clip.setHandCursor(true);
        this.on('shown', this.onShown);
        this.model.on('change', this.onBudgetInfoChanged);
    },

    onShown: function()
    {
        this.clip.glue("share-budget-copy-url-btn", "share-budget-copy-url-wrapper");
        // fix position
        $(this.clip.div).css({ left: 0, top: 0 });
    },

    onBudgetInfoChanged: function()
    {
        this.$budgetName.text(this.model.get('name'));
        this.$budgetUrl.val(this.model.getUrl());
        this.clip.setText(this.model.getUrl());
        this.$shareButtons.attr('addthis:url', this.model.getUrl());
        this.$shareButtons.attr('addthis:title', "Check out my budget");
    },

    onBudgetUrlFocus: function()
    {
        this.$budgetUrl.select();
    },

    onBudgetUrlMouseUp: function(e)
    {
        e.preventDefault();
        return false;
    },

    showBudgetAllocator: function()
    {
        TGM.vent.trigger('showSidePane', 'budget-allocator');
    }

});