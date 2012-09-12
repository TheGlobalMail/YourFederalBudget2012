window.location.origin = window.location.origin || window.location.protocol+'//'+window.location.host+'/';

var TGM = { Views: {}, Models: {}, Routers: {}, Collections: {} };
TGM.vent = _.extend({}, Backbone.Events);
TGM.vent.publish = TGM.vent.trigger;