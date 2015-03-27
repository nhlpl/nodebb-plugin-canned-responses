"use strict";

var controllers = require('./lib/controllers'),
	middleware = require('./lib/middleware'),

	plugin = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers,
		routeHelpers = module.parent.require('./routes/helpers'),
		checks = [hostMiddleware.authenticate, hostMiddleware.exposeUid, middleware.restrictToProfileOwner];
		
	// Might have ACP integration soon, but not now.
	// router.get('/admin/plugins/canned-responses', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	// router.get('/api/admin/plugins/canned-responses', controllers.renderAdminPage);

	// User settings routes
	routeHelpers.setupPageRoute(router, '/user/:userslug/canned-responses', hostMiddleware, checks, controllers.list);
	router.route('/user/:userslug/canned-responses/:responseId?')
		.post(checks, controllers.add)
		.delete(checks, controllers.delete);

	callback();
};

plugin.addProfileItem = function(links, callback) {
	links.push({
		id: 'canned-responses',
		route: 'canned-responses',
		icon: 'fa-bullhorn',
		name: 'Canned Responses',
		public: false
	});

	callback(null, links);
};

plugin.addComposerButton = function(payload, callback) {
	payload.options.push({ name: 'canned-responses', className: 'fa fa-bullhorn' });
	callback(null, payload);
};

module.exports = plugin;