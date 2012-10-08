TGM.Views.MoreInfo = Backbone.View.extend({

    initialize: function()
    {
        _.bindAll(this);
        this.$title        = this.$('.title');
        this.$info         = this.$('.info');
        this.$extendedInfo = this.$('.extended-info');
        this.$readMore     = this.$('.read-more');

        TGM.vent.on('BudgetAllocatorCategory:expanding', this.showCategory);
    },

    showCategory: function(categoryId)
    {
        // cache current category
        this.categoryId = categoryId;
        this.category = DATA.categories[categoryId];

        this.$title.html(this.category.label);
        this.$info.html($("#summary-" + categoryId).children().clone());
        this.$readMore.prop('href', '/more-info/' + categoryId);
        this.$extendedInfo.find('.modal-body').load(this.$readMore.prop('href'));
    }

});