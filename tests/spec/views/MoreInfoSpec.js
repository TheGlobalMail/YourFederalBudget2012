describe("More Info View", function() {
    var moreInfo, $el = $([
        '<div>',
            '<div class="title"></div>',
            '<div class="info"></div>',
            '<div class="modal extended-info hide fade">',
                '<div class="modal-body"></div>',
            '</div>',
            '<a href="#" class="read-more">Re</a>',
        '</div>'
    ].join(""));

    var summaryTemplate = '<div id="summary-immigration"><span>Immigration</span></div>'

    beforeEach(function() {
        moreInfo = new TGM.Views.MoreInfo({ el: $el.clone() });
        this.clock = sinon.useFakeTimers();
        moreInfo.$el.appendTo('body');
        sinon.stub(jQuery, "ajax");
        $(summaryTemplate).appendTo('body');
    });

    afterEach(function() {
        moreInfo.$el.remove();
        this.clock.restore();
        jQuery.ajax.restore();
        $("#summary-immigration").remove();
    });

    it("should update short info and title when active category changes", function() {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'immigration');

        expect(moreInfo.$title).toHaveText(/Immigration/);
        expect(moreInfo.$info).toHaveText(/Immigration/);
    });
});