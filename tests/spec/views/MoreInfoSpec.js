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

    beforeEach(function() {
        moreInfo = new TGM.Views.MoreInfo({ el: $el.clone() });
        this.clock = sinon.useFakeTimers();
        moreInfo.$el.appendTo('body');
    });

    afterEach(function() {
        moreInfo.$el.remove();
        this.clock.restore();
    });

    it("should update short info and title when active category changes", function() {
        TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'health');

        expect(moreInfo.$title).toHaveText(/Health/);
        expect(moreInfo.$info).toHaveText(/Health/);
    });

    describe("Extended Info", function() {
        beforeEach(function() {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'health');
        });

        it("shouldn't be visible by default", function() {
            expect(moreInfo.$extendedInfo).toHaveClass('hide');
        });

        it("should show the modal when read more is click", function() {
            moreInfo.$('.read-more').trigger('click');
            this.clock.tick(200)

            expect(moreInfo.$extendedInfo).toBeVisible();
        });

        it("should update the extended info when active category changes", function() {
            TGM.vent.trigger('BudgetAllocatorCategory:expanding', 'education');
            expect(moreInfo.$modalBody).toHaveText(/Education/);
        });
    });
});