TGM.Views.SidePaneManager = Backbone.View.extend({

    sidePanes: {},

    initialize: function()
    {
        _.bindAll(this);
        TGM.vent.on("showSidePane", this.showPane);
        this.model.on('sync', this.updateLabels);
        this._currentPane();

        if (!this.model.isNew()) {
            this.updateLabels();
        }
    },

    addSidePane: function(id, sidePane)
    {
        this.sidePanes[id] = sidePane;
    },

    addSidePanes: function(sidePanes)
    {
        _.each(sidePanes, function(sidePane, id) {
            this.addSidePane(id, sidePane);
        }, this);
    },

    _currentPane: function()
    {
        if (!this.currentPane) {
            var paneEl = this.$('.sidepane:visible');

            this.currentPane = _.find(this.sidePanes, function(pane) {
                return pane.$el[0] == paneEl[0];
            });
        }
    },

    selectTab: function(index)
    {
        var currentTab = this.$('.nav .active');
        var newTab = this.$('li').eq(index);

        if (currentTab[0] == newTab[0]) {
            return false;
        }

        currentTab.removeClass('active');
        newTab.addClass('active');
    },

    showPane: function(id)
    {
        this._currentPane();

        if (this.isSwitching || !id in this.sidePanes) {
            return false;
        }

        if (this.currentPane == this.sidePanes[id]) {
            this.currentPane.trigger('shown');
            return false;
        }

        this.isSwitching = true;
        this.selectTab(this.sidePanes[id].getTab());
        // eeww callback soup, clean up with deferreds?
        this.currentPane.hide(_.bind(function() {
            this.sidePanes[id].show(_.bind(function() {
                this.isSwitching = false;
            }, this))
        }, this));

        this.currentPane = this.sidePanes[id];
    },

    updateLabels: function()
    {
        this.$('.nav li:first a').text('Edit your budget');
    }

});