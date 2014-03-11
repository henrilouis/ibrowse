var IbrowseModel = function() {

	var days = [];
	var hours = [];

	var daysSearch = [];
	var hoursSearch = [];

	var currentStats;
	var selectedItem;

	var dayMs 	= 86400000;
	var hourMs 	= 3600000;

	/********************************************************************************
		Important: days[i] finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date.
		The second one (days[i][1]) has the individual url visits from google.
		The third days[i][2] is an array containing the number of visits per site.
		
	*********************************************************************************/
	function getHistory(timeUnit, targetArray){

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
			'text':'',
			'startTime': d.getTime(),
			'endTime':  interval.getTime(),
			'maxResults': 9999999
			},
			function(historyItems){
				tempData.push(historyItems);
				if (countTime >= endTime){
					arrayFromHistory(tempData, targetArray, timeUnit, startTime);
					notifyObservers('dataReady');

					// doing one search to fill the array, bit dirty
					searchDays("");
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

	function searchDays(string)
	{
		var data = [];
		for (i = 0; i<days.length; i++)
		{
			var day = [];
			day.push(days[i][0]);

			var result = days[i][1].filter(function(d)
			{
				if(d['url'].indexOf(string.toLowerCase())>=0)
				{
					return d;
				}
			});
			day.push(result);
			
			data.push(day);
		}		
		daysSearch = data;
		notifyObservers('searchComplete');
	}

	function searchHours(string)
	{
		var data = [];
		for (i = 0; i<hours.length; i++)
		{
			var hour = [];
			hour.push(hours[i][0]);

			var result = hours[i][1].filter(function(d)
			{
				if(d['url'].indexOf(string.toLowerCase())>=0)
				{
					return d;
				}
			});
			hour.push(result);
			
			data.push(hour);
		}

		hoursSearch = data;
		return data;
	}

	// Helper functions
	function toJSON(history){
		var json = {};
		for(i=0; i < history.length; i++){
			json[Math.round(history[i][0].getTime()/1000)] = history[i][1].length;
		}
		return json;
	}

	// Setters
	function setSelectedItem(item)
	{
		selectedItem = item;
		notifyObservers('itemSelected');
	}

	function setCurrentStats(stats){
		currentStats = stats;
		notifyObservers('dayStats');
	}

	// Getters
	function getDays(){
		return days;
	}

	function getDailyMax(){
		var max = 0;
		for(i = 0; i < days.length; i++){
			if(days[i][1].length > max){
				max = days[i][1].length;
			}
		}
		return max;
	}

	function getHourlyMax(){
		var max = 0;
		for(i = 0; i < hours.length; i++){
			if(hours[i][1].length > max){
				max = hours[i][1].length;
			}
		}
		return max;
	}

	function getCurrentStats(){
		return currentStats;
	}

	function getDaysSearch()
	{
		return daysSearch;
	}

	function getSelectedItem()
	{
		return selectedItem;
	}

	// fill them once
	getHistory(dayMs,days);
	//searchDays("");

	this.days = days;

	this.getHistory = getHistory;
	this.searchDays = searchDays;

	this.getDaysSearch = getDaysSearch;

	this.getDailyMax = getDailyMax;
	this.getHourlyMax = getHourlyMax;
	this.toJSON = toJSON;

	this.setCurrentStats = setCurrentStats;
	this.getCurrentStats = getCurrentStats;

	this.setSelectedItem = setSelectedItem;
	this.getSelectedItem = getSelectedItem;

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