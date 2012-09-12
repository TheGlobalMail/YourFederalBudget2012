window.location.origin = window.location.origin || window.location.protocol+'//'+window.location.host+'/';

(function() {
    var hasSVG = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    if (!hasSVG) {
        $('html').addClass('no-svg');
    }
})();

var TGM = { Views: {}, Models: {}, Routers: {}, Collections: {} };
TGM.vent = _.extend({}, Backbone.Events);
TGM.vent.publish = TGM.vent.trigger;