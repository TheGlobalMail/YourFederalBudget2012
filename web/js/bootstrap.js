var TGM = { Views: {}, Models: {}, Routers: {} };
TGM.vent = _.extend({}, Backbone.Events);
TGM.vent.publish = TGM.vent.trigger;