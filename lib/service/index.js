var getGrades = require("./grades").getGrades, getClasses = require("./classes").getClasses;
exports.serve = function (e) {
	return Promise.resolve().then(function () {
		return 0 == e.type ? getClasses(e.username, e.password).then(function (e) {
			return {
				result : 0,
				message : "success",
				classes : e
			}
		}) : getGrades(e.username, e.password).then(function (e) {
			return {
				result : 0,
				message : "success",
				grades : e
			}
		})
	})
};
