var qs = require("qs"), keys = {
	test : !0
}, parseIncomingDataToJson = function (n) {
	return new Promise(function (r, e) {
		var o = [],
		t = 0,
		i = 1;
		n.on("readable", function () {
			var r = n.read();
			t += r.length,
			r instanceof Buffer && (i = 0),
			o.push(r)
		}),
		n.on("error", function (n) {
			e(n)
		}),
		n.on("end", function () {
			r(1 == i ? o.join("") : Buffer.concat(o, t).toString())
		}).then(function (n) {
			return JSON.parse(n)
		})
	})
}, auth = function (n) {
	return Promise.resolve().then(function () {
		if (1 != keys[n]) {
			var r = new Error("no privilege");
			throw r
		}
	})
};
exports.auth = auth, exports.parseIncomingDataToJson = parseIncomingDataToJson, exports.sendOKRes = function (n, r) {
	n.writeHead(200, {
		"Content-Type" : "application/json"
	}),
	n.end(JSON.stringify(r))
}, exports.sendError = function (n, r) {
	var e = {
		result : 1,
		message : r.message || "unknown error !"
	};
	n.writeHead(404, {
		"Content-Type" : "application/json"
	}),
	n.end(JSON.stringify(e))
}, exports.getIncomingDataFromUrl = function (n) {
	return Promise.resolve().then(function () {
		var r = n.url;
		if (console.log(r), "/favicon.ico" == r) {
			var e = new Error("Not Found");
			throw e
		}
		return r.split("/")[1]
	}).then(function (n) {
		var r = qs.parse(n);
		return r
	})
};
