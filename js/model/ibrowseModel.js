var IbrowseModel = function() {

	var days = [];
	var hours = [];
	var currentStats;

	var dayMs 	= 86400000;
	var hourMs 	= 3600000;

	/********************************************************************************
		Important: days[i] finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date.
		The second one (days[i][1]) has the individual url visits from google.
		The third days[i][2] is an array containing the number of visits per site.
		
	*********************************************************************************/
	function getHistory(timeUnit, searchString, targetArray){

		var tempData = [];

		// 90 days because sadly Chrome only saves history for 90 days
		var startTime = new Date();
			startTime.setDate(startTime.getDate()-90);
		var endTime = new Date();

		// Counter for asynch chrome function
		var countTime = new Date();
			countTime.setTime(startTime.getTime());

		var d = new Date();
			d.setTime(startTime.getTime());

		for(d; d<= endTime; d.setTime(d.getTime()+timeUnit)){
			var interval = new Date();
				interval.setTime(d.getTime()+timeUnit);

			chrome.history.search({
			'text':searchString,
			'startTime': d.getTime(),
			'endTime':  interval.getTime(),
			'maxResults': 9999999
			},
			function(historyItems){
				tempData.push(historyItems);
				if (countTime >= endTime){
					arrayFromHistory(tempData, targetArray, timeUnit, startTime);
					notifyObservers('dataReady');
				}
				else{
					countTime.setTime(countTime.getTime()+timeUnit);
				}
			});
		}
	}

	function arrayFromHistory(historyData, targetArray, timeUnit, startTime){

		var d = new Date(startTime.getTime());

		for(i = 0; i < historyData.length; i++){
			var urlArray = new Array();

			// Getting the starting of the url
			for(j = 0; j<historyData[i].length; j++){
				var url = $('<a>').prop('href',historyData[i][j].url).prop('hostname');
				urlArray.push(url);
			}

			// Creating associative array from url count
			var counts = new Array();
			urlArray.forEach(function(x){ 
				counts[x] = (counts[x] || 0)+1; 
			});

			// Make a normal array out of the associative one
			var countsNormalArray = new Array();
			for(key in counts){
				countsNormalArray.push([key,counts[key]]);
			}

			// Sorting the array in descending order
			countsNormalArray.sort(function(a,b){
				return b[1]-a[1];
			});

			targetArray.push([new Date(d.getTime()),historyData[i],countsNormalArray]);
			d.setTime(d.getTime()+timeUnit);
		}
	}


	function getDaysJSON(){
		var json = {};
		for(i=0; i < days.length; i++){
			json[Math.round(days[i][0].getTime()/1000)] = days[i][1].length;
		}
		return json;
	}

	function getHoursJSON(){
		var json = {};
		for(i=0; i < hours.length; i++){
			json[Math.round(hours[i][0].getTime()/1000)] = days[i][1].length;
		}
		return json;
	}


	function getDays(){
		return days;
	}

	function getDailyMax(){
		var max = 0;
		for(i = 0; i < days.length; i++){
			// Get the highest value per day to determine scale
			if(days[i][1].length > max){
				max = days[i][1].length;
			}
		}
		return max;
	}

	function getHourlyMax(){
		var max = 0;
		for(i = 0; i < hours.length; i++){
			// Get the highest value per day to determine scale
			if(hours[i][1].length > max){
				max = hours[i][1].length;
			}
		}
		return max;
	}

	function setCurrentStats(stats){
		currentStats = stats;
		notifyObservers('dayStats');
	}

	function getCurrentStats(){
		return currentStats;
	}

	function searchDays(string)
	{
		var data = [];
		for (i = 0; i<days.length; i++)
		{
			var day = [];
			day.push(days[i][0]);

			var result = days[i][1].filter(function(d)
			{
				if(d['url'].indexOf(string)>=0)
				{
					return d;
				}
			});
			day.push(result);
			
			data.push(day);
		}
		return data;
	}

	function searchHours(string)
	{
		
	}

	// fill them once
	getHistory(dayMs,'',days);
	this.days = days;

	this.getHistory = getHistory;
	this.searchDays = searchDays;

	this.getDailyMax = getDailyMax;
	this.getHourlyMax = getHourlyMax;
	this.getDaysJSON = getDaysJSON;
	this.getHoursJSON = getHoursJSON;

	this.setCurrentStats = setCurrentStats;
	this.getCurrentStats = getCurrentStats;

	/********************************************************
		Observable pattern is necessary because of the 
		asynchronous nature of the chrome request

	********************************************************/
	var listeners = [];
	
	notifyObservers = function (args) {
	    for (var i = 0; i < listeners.length; i++){
	        listeners[i].update(args);
	    }
	};
	
	this.addObserver = function (listener) {
	    listeners.push(listener);
	};
}