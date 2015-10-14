var external_interface = require("../external_interface");
exports.getGrades = function (e, r) {
	return Promise.resolve().then(function () {
		return external_interface.getCookie(e, r)
	}).then(function (e) {
		return external_interface.getGrades(e)
	})
};
