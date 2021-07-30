/* Magic Mirror Module Shared Kitchen */

/* Magic Mirror
 * Module: Shared Kitchen
 *
 * By Bram van Trigt - https://www.linkedin.com/in/bram-van-trigt/
 * MIT Licensed.
 */

Module.register("mmm-SharedKitchenMeals",{

        // Default module config.
        defaults: {
                APIkey: "GETYOUROWNKEY", // API key from food 2 fork
                updateInterval: 60 * 1000, // every minute
                animationSpeed: 1000,
                listSize: 4,
                maxTitleSize: 40,
                fade: false,
                fadePoint: 0.25, // Start on 1/4th of the list.
                initialLoadDelay: 2500, // 2.5 seconds delay.
                retryDelay: 2500,
                apiSearch: "http://localhost:3000/meals/API",   //To do: build based on config file and user case.
        },

        // Define required scripts:
        // moment.js handles time notation and timezones.
        getScripts: function() {
                return ["moment.js"];
        },

        //  css stylesheets are used for styling of this MM-module.
        getStyles: function() {
                return ["myMealsStyle.css"];
        },

        // Define start sequence.
        start: function() {
                Log.info("Starting module: " + this.name);

                this.loaded = false;
                this.scheduleUpdate(this.config.initialLoadDelay);

                this.updateTimer = null;

        },
                
        // Update from website API.
        updateFromAPI: function (url, method = "GET", data = null) {
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
        },

        // Process the recieved Json information. 
        // Todo: Update with different use cases.
        processData: function(data) {
                this.myMeals = data;
                console.log(data);
                this.loaded = true;
                this.updateDom(this.config.animationSpeed);
        },

        scheduleUpdate: function(delay) {
                var nextLoad = this.config.updateInterval;
                if (typeof delay !== "undefined" && delay >= 0) {
                        nextLoad = delay;
                }
                var self = this;
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                        self.updateFromAPI()
                            .then((data) => {
                                // console.log(data);
                                self.processData(data);
                            })
                            .catch(console.log("Update from API rejected, check availability API")) 
                        //Todo: Resolve error and display loading, rejected on Magic Mirror Screen.
                }, nextLoad);
        },

        //todo: implement different use cases.
        // Override dom generator.
        getDom: function() {              
                var table = document.createElement("mealsTable");
                table.className = "myMeals";
                var row = document.createElement("tr");
                table.appendChild(row);

                var headerCell = document.createElement("th"); //todo: add food symbol to header
                        headerCell.className = "header";
                        headerCell.innerHTML = "AVAILABLE MEALS";
                        headerCell.colSpan = 3;
                        row.appendChild(headerCell);
                
                for (var l in this.myMeals) {
                        var food = this.myMeals[l];
                        var row = document.createElement("tr");
                        table.appendChild(row);

                        var mealCell = document.createElement("td");
                        mealCell.className = "name";
                        mealCell.innerHTML = food.recipeName;
                        row.appendChild(mealCell);

                        var prepTimeCell = document.createElement("td");
                        prepTimeCell.className = "prepTime";
                        prepTimeCell.innerHTML = "prep: " + food.preperationTime + "min";
                        row.appendChild(prepTimeCell);

                        var cookTimeCell = document.createElement("td");
                        cookTimeCell.className = "cookTime";
                        cookTimeCell.innerHTML = "cook: " + food.cookingTime + "min";
                        row.appendChild(cookTimeCell);

                        // Recipe description is placed in row below name and time.
                        var row = document.createElement("tr");
                        table.appendChild(row);
                        
                        var DescCell = document.createElement("td");
                        DescCell.className = "desc";
                        DescCell.innerHTML = food.description;
                        DescCell.colSpan = 3;
                        row.appendChild(DescCell);

                        //todo: change the fade to start from a lower row
                        if (this.config.fade && this.config.fadePoint < 1) {
                                if (this.config.fadePoint < 0) {
                                        this.config.fadePoint = 0;
                                }
                                var startingPoint = this.foodlist.length * this.config.fadePoint;
                                var steps = this.foodlist.length - startingPoint;
                                if (l >= startingPoint) {
                                        var currentStep = l - startingPoint;
                                        row.style.opacity = 1 - (1 / steps * currentStep);
                                }
                        }
                    
                }
                return table;
        }
});


// update needs to be scheduled
// Extend functionality to shopping list and Recipe display, can be done with cases see Weather module functionality.