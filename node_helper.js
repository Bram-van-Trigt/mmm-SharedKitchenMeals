var request = require('request');
var NodeHelper = require("node_helper");
const { resolveConfig } = require('prettier');

module.exports = NodeHelper.create({

        start: function() {
                console.log("Starting node helper: " + this.name);
        },

        updateAPI: function (url, method = "GET", data = null) {
                var url = this.config.apiSearch;
                        console.log('Started update from ' + url)
                        return new Promise(function (resolve, reject) {
                    const request = new XMLHttpRequest();
                    request.open(method, url, true);
                    request.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                var text = this.response
                                let result = text.replaceAll(/&quot;/g, '\"');
                                resolve(JSON.parse(result));
                            } else {
                                reject(request);
                                console.log('API request rejected');
                            }
                        }
                    };
                    request.send();
                });
        }
});