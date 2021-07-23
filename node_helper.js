var request = require('request');
var NodeHelper = require("node_helper");
const { resolveConfig } = require('prettier');

module.exports = NodeHelper.create({

        start: function() {
                console.log("Starting node helper: " + this.name);
        },

        socketNotificationReceived: function(notification, payload) {
                var self = this;
                console.log("Downloading available meals with signal: " + notification + " From URL: " + payload.url);

                if(notification === "GET_RECIPE"){

                        var recipeJsonUri = payload.url;

                        request(recipeJsonUri, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                        console.log(body);
                                        console.log.resolve(JSON.parse(this.response));
                                        self.sendSocketNotification("RECIPE", JSON.parse(body));
                                }
                        });

                }

        },
});

	// // A convenience function to make requests. It returns a promise.
	// fetchData: function (url, method = "GET", data = null) {
	// 	return new Promise(function (resolve, reject) {
	// 		const request = new XMLHttpRequest();
	// 		request.open(method, url, true);
	// 		request.onreadystatechange = function () {
	// 			if (this.readyState === 4) {
	// 				if (this.status === 200) {
	// 					resolve(JSON.parse(this.response));
	// 				} else {
	// 					reject(request);
	// 				}
	// 			}
	// 		};
	// 		request.send();
	// 	});