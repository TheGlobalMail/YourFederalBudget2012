describe("More Info View", function() {
    var moreInfoView, $el = $('<div><div class="title"></div><div class="info"></div></div>');

    beforeEach(function() {
        moreInfoView = new TGM.Views.MoreInfoView({ el: $el.clone() });
    });

    it("should update info when active category changes", function() {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'health');

        expect(moreInfoView.$title).toHaveText('Health');
    });
});