var request = require("request");

module.exports = function (url, cb) {
	request(url, function (err, res, body) {
		if (err || res.statusCode !== 200) {
			console.log(err);
		} else {
			try {
				body = JSON.parse(body);
			} catch (notJson) {
				err = notJson;
			}
		}
		if (typeof cb === "function") {
			cb(err, body);
		}
	});
};
