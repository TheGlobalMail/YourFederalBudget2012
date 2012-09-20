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
        spyOn(router, 'goto');

        router.loadBudget('dud-budget-id');
        this.server.respond();

        expect(router.goto).toHaveBeenCalledWith('');
    });

    it("should make an unsaved userBudget the active budget when returning to Create Your Budget after viewing someone elses budget", function() {
        var router = getRouter(['models']);
        var isActive = false;

        router.models.userBudget.set('testVal', 'yes');
        router.models.activeBudget = new TGM.Models.Budget({ '_id': 'test' });

        TGM.vent.on('activeBudget', function(activeBudget) {
            if (activeBudget == router.models.userBudget) {
                isActive = true;
            }
        });

        router.index();

        expect(isActive).toBeTruthy();
        expect(router.models.activeBudget.cid).toEqual(router.models.userBudget.cid);
        expect(router.models.userBudget.get('testVal')).toEqual('yes');
    });

});