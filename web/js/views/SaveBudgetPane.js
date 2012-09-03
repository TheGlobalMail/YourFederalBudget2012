TGM.Views.SaveBudgetPane = TGM.Views.SidePane.extend({

    events: {
        "submit form": "save",
        "reset form": "reset"
    },

    save: function(e)
    {
        event.preventDefault();

        var data = {
            name: this.$(".your-name-wrapper input").val(),
            email: this.$(".your-email-wrapper input").val(),
            description: this.$(".budget-description textarea").val()
        }

        this.model.set(data);
        this.model.save({
            success: this.success,
            error: this.error
        });
    },

    reset: function(e)
    {
        e.preventDefault();
        TGM.vent.trigger("showSidePane", "budget-allocator");
    },

    success: function(model, response)
    {
        console.log(response);
    },

    error: function(model, response)
    {
        console.log(response);
    }

});