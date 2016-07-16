var remote = require("./remote.js");

module.exports = function (pkg, data) {
	"use strict";
	var defaults = {HOME: "200", NOT_FOUND: "404"};
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
			var url = get(req.params.id || defaults.HOME); // || get(defaults.NOT_FOUND);
			if (url) {
				// TODO append to log
				res.redirect(301, url.target);
			} else {
				url = get(defaults.NOT_FOUND);
				if (url) {
					remote(url.target, function (err, data) {
						res.status(404).send(err ? undefined : data);
					});
				} else {
					res.status(404).send();
				}
			}
		},
		error: function (req, res) {
			res.status(404).send();
		}
	};
};
