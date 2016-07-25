var path = require("path");
var fetchRemote = require("./remote.js");

module.exports = function (pkg) {
	"use strict";
	var get = function (id) {
		var url = pkg.config.urls[id];
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
		admin: function (req, res, next) {
			var action = req.params.action;
			if (["urls", "remote"].indexOf(action) !== -1) {
				res.send(pkg.config[action]);
			} else {
				next();
			}
		},
		refresh: function (req, res, next) {
			fetchRemote(pkg.config.remote, function (err, urls) {
				if (err) {
					console.warn("Express server not updated", Object.keys(urls).length);
				} else {
					console.info("Express server updated, now serving %s links", Object.keys(urls).length);
					pkg.config.urls = urls;
				}
			});
			if (typeof next === "function") {
				next();
			}
		},
		forward: function (req, res, next) {
			var url = get(req.params.id);
			if (url) {
				// TODO append to log
				res.setHeader("Cache-Control", "public, max-age=" + 24 * 60 * 60 * 1000);
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
