/*jshint node: true */
"use strict";
var fs = require("fs");
var path = require("path");

// Configuration
var pkg = require(path.join(__dirname, "package.json"));
pkg.config = pkg.config || {};
pkg.config.data = process.env.DATA || pkg.config.data || path.join(__dirname, "data");
pkg.config.dataLatest = path.join(pkg.config.data, "urls.json");
pkg.config.port = process.env.PORT || pkg.config.port || 8080;

fs.access(pkg.config.data, fs.R_OK | fs.W_OK, function (err) {
	if (err) {
		console.error(err);
		console.error("Express server requires READ/WRITE access to %s.", pkg.config.data);
		process.exit(1);
	}
	var data;
	try {
		data = require(pkg.config.dataLatest);
	} catch (err) {
		console.error(err);
		console.error("Check your configuration. No data file found at %s.", pkg.config.dataLatest);
		process.exit(1);
	}

	// Initialization
	var app = require("express")();
	app.set("port", pkg.config.port);
	app.locals.basedir = path.join(__dirname, "views");
	app.set("views", path.join(__dirname, "views"));
	app.set("view engine", "jade");

	// Routes
	var routes = require(path.join(__dirname, "routes.js"))(pkg, data);
	app.all("*", routes.log);
	app.get("/:id", routes.forward);
	app.get("/", routes.forward);
	app.use(routes.error);

	// Http server
	require("http").createServer(app).listen(pkg.config.port, function () {
		console.info("[%s] Express server running, listening on PORT %d", new Date().toISOString(), pkg.config.port);
	});

});
