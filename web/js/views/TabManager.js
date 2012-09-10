TGM.Views.TabManager = Backbone.View.extend({

    selectTab: function(index)
    {
        var currentTab = this.$('.active');
        var newTab = this.$('li').eq(index);

        if (currentTab[0] == newTab[0]) {
            return false;
        }

        currentTab.removeClass('active');
        newTab.addClass('active');
    }

});