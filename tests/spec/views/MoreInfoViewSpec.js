describe("More Info View", function() {
    var moreInfoView, $el = $([
        '<div>',
            '<div class="title"></div>',
            '<div class="info"></div>',
            '<div class="modal extended-info hide fade">',
                '<div class="modal-body"></div>',
            '</div>',
            '<a href="#" class="read-more">Re</a>',
        '</div>'
    ].join(""));

    beforeEach(function() {
        moreInfoView = new TGM.Views.MoreInfoView({ el: $el.clone() });
        this.clock = sinon.useFakeTimers();
        moreInfoView.$el.appendTo('body');
    });

    afterEach(function() {
        moreInfoView.$el.remove();
        this.clock.restore();
    });

    it("should update short info and title when active category changes", function() {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'health');

        expect(moreInfoView.$title).toHaveText(/Health/);
        expect(moreInfoView.$info).toHaveText(/Health/);
    });

    describe("Extended Info", function() {
        beforeEach(function() {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'health');
        });

        it("shouldn't be visible by default", function() {
            expect(moreInfoView.$extendedInfo).toHaveClass('hide');
        });

        it("should show the modal when read more is click", function() {
            moreInfoView.$('.read-more').trigger('click');
            this.clock.tick(200)

            expect(moreInfoView.$extendedInfo).toBeVisible();
        });

        it("should update the extended info when active category changes", function() {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'education');
            expect(moreInfoView.$modalBody).toHaveText(/Education/);
        });
    });
});