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
        Backbone.history.start();
    });

    afterEach(function() {
        this.server.restore();
        Backbone.history.stop();
    });

    it("should redirect to / when the user loads a budget that doesn't exist", function() {
        this.server.respondWith("GET", "/api/budget/dud-budget-id", [404, "", ""]);
        var router = getRouter(['models']);
        var spy = sinon.spy(router, 'goto');

        router.editBudget('dud-budget-id');
        this.server.respond();

        expect(spy).toHaveBeenCalledWith('budget', 'dud-budget-id');
        spy.restore();
    });

    it("should make an unsaved userBudget the active budget when returning to Create Your Budget after viewing someone elses budget", function() {
        var router = getRouter(['models']);
        var spy = sinon.spy();

        router.models.userBudget.set('testVal', 'yes');
        router.models.activeBudget = new TGM.Models.Budget({ '_id': 'test' });

        TGM.vent.on('activeBudget', spy);

        router.index();

        expect(spy).toHaveBeenCalledWith(router.models.userBudget);
        expect(router.models.activeBudget.cid).toEqual(router.models.userBudget.cid);
        expect(router.models.userBudget.get('testVal')).toEqual('yes');
    });

    describe("View Budgets", function() {
        it("should activate the latest budget in they don't have a budget saved", function() {
            var router = getRouter(['models']);
            var otherBudget = new TGM.Models.Budget({ name: 'Other budget', id: 'rahrahblahaha' })
            router.collections.budgets.add([otherBudget], { silent: true });

            router.viewBudgets();

            expect(router.models.activeBudget).toEqual(otherBudget);
        });

        it("should activate their budget if it is saved", function() {
            var router = getRouter(['models']);
            router.models.activeBudget = false;
            var stub = sinon.stub(router.models.userBudget, 'isNew').returns(false);

            router.viewBudgets();
            expect(router.models.activeBudget).toEqual(router.models.userBudget);
            stub.restore();
        });
    });
});