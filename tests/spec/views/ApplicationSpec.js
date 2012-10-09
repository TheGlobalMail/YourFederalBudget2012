describe("Application view", function() {
    var appView, heightStub, widthStub;

    beforeEach(function() {
        appView    = new TGM.Views.Application({ el: $(document.body) });
        widthStub  = sinon.stub(appView.$window, "width");
        heightStub = sinon.stub(appView.$window, "height");
        appView.currentSize = false;
    });

    afterEach(function() {
        TGM.vent.off("resized");
        appView.close();
    });

    function resizeTo(width, height) {
        widthStub.returns(width);
        heightStub.returns(height);
        appView.onResize();
    }

    it("should notify when the app has been resized to small view", function() {
        var spy = sinon.spy();
        TGM.vent.on('resized', spy);

        resizeTo(1025, 768);

        expect(appView.currentSize).toEqual('small');
        expect(spy).toHaveBeenCalledWith('small');
    });

    it("should notify when the app has been resized to medium view", function() {
        var spy = sinon.spy();
        TGM.vent.on('resized', spy);

        resizeTo(1200, 800);

        expect(appView.currentSize).toEqual('medium');
        expect(spy).toHaveBeenCalledWith('medium');
    });

    it("should notify when the app has been resized to the large view", function() {
        var spy = sinon.spy();
        TGM.vent.on('resized', spy);

        resizeTo(1440, 900);

        expect(appView.currentSize).toEqual('large');
        expect(spy).toHaveBeenCalledWith('large');
    });

});