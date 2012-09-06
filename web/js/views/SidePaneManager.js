TGM.Views.SidePaneManager = Backbone.View.extend({

    sidePanes: {},

    initialize: function()
    {
        _.bindAll(this);
        TGM.vent.on("showSidePane", this.showPane);
    },

    addSidePane: function(id, sidePane)
    {
        this.sidePanes[id] = sidePane;
    },

    showPane: function(id)
    {
        if (!this.currentPane) {
            var paneEl = this.$('.sidepane:visible');

            this.currentPane = _.find(this.sidePanes, function(pane) {
                return pane.$el[0] == paneEl[0];
            });
        }

        if (this.isSwitching || !id in this.sidePanes) {
            return false;
        }

        this.isSwitching = true;

        // eeww callback soup, clean up with deferreds?
        this.currentPane.hide(_.bind(function() {
            this.sidePanes[id].show(_.bind(function() {
                this.isSwitching = false;
            }, this))
        }, this));

        this.currentPane = this.sidePanes[id];
    }

});