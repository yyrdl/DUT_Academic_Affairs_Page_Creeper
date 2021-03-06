var qs = require("qs"), http = require("http"), cheerio = require("cheerio"), iconv = require("iconv-lite");
exports.getCookie = function (e, t) {
	return console.log(e),
	console.log(t),
	new Promise(function (r, n) {
		var c = qs.stringify({
				zjh : e,
				mm : t
			}),
		o = {
			method : "POST",
			host : "202.118.65.20",
			port : 8090,
			path : "/loginAction.do",
			headers : {
				"Content-Type" : "application/x-www-form-urlencoded",
				"Content-Length" : c.length
			}
		},
		a = http.request(o);
		a.on("error", function (e) {
			console.error(e.stack),
			n(e)
		}),
		a.on("response", function (e) {
			var t = e.headers["set-cookie"][0].split(";")[0],
			c = [],
			o = 0;
			e.on("data", function (e) {
				c.push(e),
				o += e.length
			}),
			e.on("error", function (e) {
				console.error(e.stack),
				n(e)
			}),
			e.on("end", function () {
				var e = iconv.decode(Buffer.concat(c, o), "gbk");
				e = e.toString("utf8");
				var a = cheerio.load(e);
				if (a("#userName_label").length > 0) {
					var s = new Error("wrong username or password");
					n(s)
				} else
					r(t)
			})
		}),
		a.write(c),
		a.end()
	})
};
var getBody = function (e, t) {
	return new Promise(function (r, n) {
		var c = {
			method : "GET",
			host : "202.118.65.20",
			port : 8090,
			path : t,
			headers : {
				Cookie : e,
				"Accept-Encoding" : "gzip, deflate, sdch",
				Accept : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language" : "zh-CN,zh;q=0.8,en;q=0.6",
				Pragma : "no-cache",
				"Upgrade-Insecure-Requests" : 1,
				"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36"
			}
		},
		o = http.request(c);
		o.on("error", function (e) {
			console.error(e.stack),
			n(e)
		}),
		o.on("response", function (e) {
			var t = [],
			c = 0;
			e.on("data", function (e) {
				c += e.length,
				t.push(e)
			}),
			e.on("error", function (e) {
				console.error(e.stack),
				n(e)
			}),
			e.on("end", function () {
				r(Buffer.concat(t, c))
			})
		}),
		o.end()
	})
}, reduceNchar = function (e) {
	var t = "",
	r = e.split("");
	return r.forEach(function (e) {
		" " == e || "\n" == e || "	" == e || "\r" == e || (t += e)
	}),
	t
};
exports.getClasses = function (e) {
	return Promise.resolve().then(function () {
		var t = "/xkAction.do?actionType=6";
		return getBody(e, t)
	}).then(function (e) {
		for (var t = iconv.decode(e, "gbk"), r = t.toString("utf8"), n = cheerio.load(r), c = n("#user"), o = n(c[1]).find(".odd"), a = [], s = 0; s < o.length; s++) {
			var i = n(o[s]).find("td");
			if (i.length > 7) {
				var u = {
					class_name : "",
					class_teachers : "",
					class_date : []
				};
				console.log(n(i[2]).text()),
				u.class_name = reduceNchar(n(i[2]).text()),
				u.class_teachers = reduceNchar(n(i[7]).text());
				var h = {
					class_weeks : reduceNchar(n(i[11]).text()),
					class_time : {
						which_weekday : parseInt(reduceNchar(n(i[12]).text())),
						which_class : parseInt(reduceNchar(n(i[13]).text())),
						num : parseInt(reduceNchar(n(i[14]).text()))
					},
					class_address : reduceNchar(n(i[16]).text()) + " " + reduceNchar(n(i[17]).text())
				};
				u.class_date.push(h),
				a.push(u)
			} else {
				var d = {
					class_weeks : reduceNchar(n(i[0]).text()),
					class_time : {
						which_weekday : parseInt(reduceNchar(n(i[1]).text())),
						which_class : parseInt(reduceNchar(n(i[2]).text())),
						num : parseInt(reduceNchar(n(i[3]).text()))
					},
					class_address : reduceNchar(n(i[5]).text()) + " " + reduceNchar(n(i[6]).text())
				},
				l = a.length;
				l > 0 && a[l - 1].class_date.push(d)
			}
		}
		return a
	})["catch"](function (e) {
		return console.error(e.stack),
		[]
	})
}, exports.getGrades = function (e) {
	return Promise.resolve().then(function () {
		var t = "/gradeLnAllAction.do?type=ln&oper=qb";
		return getBody(e, t).then(function (e) {
			return e.toString()
		})
	}).then(function (e) {
		var t = cheerio.load(e),
		r = t("iframe").attr("src");
		return r
	}).then(function (t) {
		var r = "/" + t;
		return getBody(e, r)
	}).then(function (e) {
		var t = iconv.decode(e, "gbk");
		t = t.toString("utf8");
		var r = cheerio.load(t),
		n = [];
		return r("a").each(function () {
			var e = {
				semester : r(this).attr("name"),
				grade : []
			};
			n.push(e)
		}),
		r(".titleTop2").each(function (e) {
			r(this).find(".odd").each(function () {
				var t = {
					class_name : "",
					class_credit : 0,
					class_attribute : "",
					class_score : 0
				},
				c = r(this).find("td");
				t.class_name = reduceNchar(r(c[2]).text()),
				t.class_credit = parseFloat(r(c[4]).text()),
				t.class_attribute = reduceNchar(r(c[5]).text()),
				t.class_score = parseFloat(r(c[6]).text()),
				n[e].grade.push(t)
			})
		}),
		n
	})["catch"](function (e) {
		return console.error(e.stack),
		[]
	})
};
