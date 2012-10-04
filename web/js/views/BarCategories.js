TGM.Views.BarCategories = Backbone.View.extend({

    events: {
        'click .category': 'onCategoryClick'
    },

    initialize: function()
    {
        _.bindAll(this, 'onCategoryClick');
        TGM.vent.on('BudgetAllocatorCategory:expanding', this.onCategoryActivated, this);
    },

    onCategoryClick: function(e)
    {
        var category = $(e.currentTarget).data('id');

        if (category) {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', category);
        }
    },

    onCategoryActivated: function(category)
    {
        var $current = this.$('.category.active');

        if ($current.data('id') != category) {
            $current.removeClass('active');
            this.$('.category.' + category).addClass('active');
        }
    }

});