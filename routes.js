module.exports = function (pkg, data) {
	"use strict";
	var defaults = {HOME: "200"};
	var get = function (id) {
		var url = data[id];
		if (url) {
			url = {
				id: id,
				target: url
			};
		}
		return url;
	};
	return {
		log: function (req, res, next) {
			console.info(req.method, req.path);
			next();
		},
		forward: function (req, res) {
			var url = get(req.params.id || defaults.HOME);
			if (url) {
				// TODO append to log
				res.redirect(301, url.target);
			} else {
				res.status(404).send();
			}
		},
		error: function (req, res) {
			res.status(404).send();
		}
	};
};
