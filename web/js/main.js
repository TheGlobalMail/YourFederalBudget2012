var bootstrap = function() {
    var find = function(selector) {
        return $('body').find(selector);
    }

    _.each(["appViews", "models", "barGraph", "sidePanes", "loadBudgets"], function(b) {
        TGM.bootstrappers[b].call(this, find);
    }, this);
};

window.appRouter = new TGM.Routers.AppRouter({ bootstrap: bootstrap });
Backbone.history.start({ pushState: true });

$(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    // Get the absolute root.
    var root = location.origin;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop && href.prop.slice(0, root.length) === root && !/more\-info/.test(href.prop)) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        evt.preventDefault();

        // `Backbone.history.navigate` is sufficient for all Routers and will
        // trigger the correct events. The Router's internal `navigate` method
        // calls this anyways.  The fragment is sliced from the root.
        Backbone.history.navigate(href.attr, true);
    }
});

// Preload AddThis icons
(new Image()).src = 'http://ct1.addthis.com/static/r07/widget006_32x32_top.png';