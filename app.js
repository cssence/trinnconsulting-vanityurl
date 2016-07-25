/*jshint node: true */
"use strict";
var path = require("path");

// Configuration
var pkg = require(path.join(__dirname, "package.json"));
pkg.config = pkg.config || {};
pkg.config.port = process.env.PORT || pkg.config.port || 8080;
pkg.config.remote = process.env.DATA_URL;
if (pkg.config.remote) {
	pkg.config.adminAccess = require("sha1")(pkg.config.remote);
}
pkg.config.urls = {};

// Initialization
var express = require("express");
var app = express();
app.set("port", pkg.config.port);

// Routes
var routes = require(path.join(__dirname, "routes.js"))(pkg);
app.all("*", routes.log);
app.use(express.static(path.join(__dirname, "public")));
if (pkg.config.adminAccess) {
	app.get("/" + pkg.config.adminAccess, routes.refresh);
	app.get("/" + pkg.config.adminAccess + "/:action", routes.admin);
}
app.get("/:id", routes.forward);
app.use(routes.error);

// Http server
require("http").createServer(app).listen(pkg.config.port, function () {
	console.info("Express server listening on PORT %d", pkg.config.port);
	if (pkg.config.remote) {
		console.info("Express server connecting to remote location identified as %s", pkg.config.adminAccess);
		routes.refresh();
	} else {
		console.warn("Express server running without any (remote) data");
	}
});
