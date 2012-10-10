TGM.Views.ShareBudgetPane = TGM.Views.SidePane.extend({

    events: {
        "focus .budget-url": "onBudgetUrlFocus",
        "mouseup .budget-url": "onBudgetUrlMouseUp"
    },

    updatedMessage: '<span class="budget-name"></span>, thanks for updating your budget!',

    initialize: function()
    {
        _.bindAll(this);

        this.$budgetName = this.$('.budget-name');
        this.$budgetUrl  = this.$('.budget-url');
        this.$shareButtons = this.$('.share-buttons');
        this.$copyWrapper = this.$('#share-budget-copy-url-wrapper');
        this.$copyButton = this.$("#share-budget-copy-url-btn");

        this.on('shown', this.onShown);
        this.on('hidden', this.onHidden);

        this.model.on('sync change', this.onBudgetInfoChanged);
        TGM.vent.on('updateMode', this.updateShareMessage);
        TGM.vent.on('resized', this.onResize);
    },

    onShown: function()
    {
        this.clip = new ZeroClipboard.Client();
        this.clip.setHandCursor(true);
        this.clip.addEventListener('onComplete', this.onUrlCopied);
        this.clip.glue(this.$copyButton[0], this.$copyWrapper[0]);
        this.onBudgetInfoChanged();
        // fix position
        $(this.clip.div).css({ left: 0, top: 0 });
        this.on('hide', _.once(function() {
            this.clip.destroy();
            this.clip.ready = false;
        }), this);
    },

    onHidden: function()
    {
        if (!this.updateMode) {
            // model has been created, now trigger update mode
            // this.updateMode is changed in an event listener
            TGM.vent.trigger('updateMode');
        }
    },

    onBudgetInfoChanged: function()
    {
        this.$budgetName.text(this.model.get('name'));
        this.$budgetUrl.val(this.model.getShortUrl());

        if (this.clip) {
            this.clip.setText(this.model.getShortUrl());
        }

        if (window.addthis) {
            window.addthis.toolbox(this.$shareButtons[0], {}, {
                url: this.model.getShortUrl(),
                title: "How would YOU spend your tax dollars? Check out my 'Budget remix', and try this great new interactive tool #auspol",
                email_template: 'Budget_email',
                email_vars: { ownership: 'their' }
            });
        }
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
        window.appRouter.goto("budget", this.model.id);
    },

    onUrlCopied: function()
    {
        var copyWrapper = this.$("#share-budget-copy-url-wrapper");
        copyWrapper.tooltip({ title: 'Budget URL Copied!', trigger: 'manual', placement: 'right' }).tooltip('show');

        setTimeout(function() {
            copyWrapper.tooltip('destroy');
        }, 2000);
    },

    updateShareMessage: function()
    {
        this.$('h1').html(this.updatedMessage);
        this.$budgetName = this.$('.budget-name');
        this.updateMode = true;
    },

    onResize: function()
    {
        if (this.clip && this.clip.reposition) {
            this.clip.reposition();
        }
    }

});