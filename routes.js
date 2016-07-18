var path = require("path");

module.exports = function (pkg, data) {
	"use strict";
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
		forward: function (req, res, next) {
			var url = get(req.params.id);
			if (url) {
				// TODO append to log
				// TODO set cache header
				res.redirect(301, url.target);
			} else {
				next();
			}
		},
		error: function (req, res, next) {
		  res.status(404);
			if (req.accepts("html")) {
				res.sendFile(path.join(__dirname, "public", "404.html")); 
				return;
			}
			if (req.accepts("json")) {
				res.send({error: "Not found"});
				return;
			}
			res.type("txt").send("Not found");
		}
	};
};
