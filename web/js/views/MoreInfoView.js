TGM.Views.MoreInfoView = Backbone.View.extend({

    events: {
        'click .read-more': "readMore"
    },

    initialize: function()
    {
        _.bindAll(this);
        this.$title        = this.$('.title');
        this.$info         = this.$('.info');
        this.$extendedInfo = this.$('.extended-info');
        this.$modalBody    = this.$('.modal-body');

        TGM.vent.on('BudgetAllocatorCategory:expanding', this.showCategory);
    },

    showCategory: function(categoryId)
    {
        this.categoryId = categoryId;
        this.category = DATA.categories[categoryId];
        this.$title.text(this.category.label);
        this.$info.html(this.category.info.short);
        this.$modalBody.html(this.category.info.extended);
    },

    readMore: function()
    {
        this.$extendedInfo.modal('toggle')
    }

});