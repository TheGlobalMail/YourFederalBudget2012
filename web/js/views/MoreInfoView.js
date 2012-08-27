TGM.Views.MoreInfoView = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);
        this.$title = this.$('.title');
        this.$info  = this.$('.info');
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.showCategory);
    },

    showCategory: function(categoryId)
    {
        var category = DATA.categories[categoryId];
        this.$title.text(category.label);
        this.$info.html(category.info);
    }

});