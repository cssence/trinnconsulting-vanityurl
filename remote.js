var request = require("request");

module.exports = function (url, cb) {
	request(url, function (err, response, body) {
		if (err && response.statusCode !== 200) {
			console.log(err);
		} else {
			var baseUrl = url.split("/").slice(0,3).join("/") + "/";
			body = body.replace("url(/", "url(" + baseUrl).replace(/\=\"\//g, "=\"" + baseUrl);
		}
		if (typeof cb === "function") {
			cb(err, body);
		}
	});
};
