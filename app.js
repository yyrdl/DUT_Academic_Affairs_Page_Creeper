var http = require("http"), tools = require("./lib/tool"), service = require("./lib/service"), handleIncomming = function (e, n) {
	tools.getIncomingDataFromUrl(e).then(function (e) {
		return tools.auth(e.key).then(function () {
			return obj = {
				username : e.username,
				password : e.password,
				type : e.type
			}
		})
	}).then(function (e) {
		return service.serve(e)
	}).then(function (e) {
		tools.sendOKRes(n, e)
	})["catch"](function (e) {
		console.error(e.stack),
		tools.sendError(n, e)
	})
}, server = http.createServer(handleIncomming);
server.listen(3e3, function () {
	console.log("Server running at 3000")
});
