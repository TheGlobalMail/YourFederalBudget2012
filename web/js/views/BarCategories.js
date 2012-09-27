TGM.Views.BarCategories = Backbone.View.extend({

    events: {
        'click .category': 'onCategoryClick'
    },

    initialize: function()
    {
        _.bindAll(this, 'onCategoryClick');
    },

    onCategoryClick: function(e)
    {
        var category = $(e.currentTarget).data('id');

        if (category) {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', category);
        }
    }

});