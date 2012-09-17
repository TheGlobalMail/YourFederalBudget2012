describe("Application router", function() {

    function getRouter(bootstrappers) {
        function bootstrap() {
            var find = function(selector) {
                return $('body').find(selector);
            }

            _.each(bootstrappers, function(b) {
                TGM.bootstrappers[b].call(this, find);
            }, this);

            var budgetId = $.jStorage.get('budgetId');
            if (budgetId) {
                this.models.userBudget.set('_id', budgetId);
                this.models.userBudget.fetch();
            }
        }

        return new TGM.Routers.AppRouter({ bootstrap: bootstrap });
    };

    beforeEach(function() {
        this.server = sinon.fakeServer.create();
    });

    afterEach(function() {
        this.server.restore();
    });

    it("should redirect to / when the user loads a budget that doesn't exist", function() {
        this.server.respondWith("GET", "/api/budget/dud-budget-id", [404, "", ""]);
        var router = getRouter(['models']);
        Backbone.history.start({ pushState: true });
        spyOn(router, 'goto');

        router.loadBudget('dud-budget-id');
        this.server.respond();

        expect(router.goto).toHaveBeenCalledWith('');
    });

    it("should redirect the user to their budget if they have one when the open the index/homepage", function() {

    });

});