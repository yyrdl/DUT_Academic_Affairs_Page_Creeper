var external_interface = require("../external_interface");
exports.getClasses = function (e, r) {
	return Promise.resolve().then(function () {
		return external_interface.getCookie(e, r)
	}).then(function (e) {
		return external_interface.getClasses(e)
	})
};
