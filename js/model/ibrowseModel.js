var IbrowseModel = function() {

	var days = [];
	var hours = [];

	var daysSearch = [];
	var hoursSearch = [];

	var currentStats;
	var selectedItem;
	var currentView;

	var hourMs 	= 3600000;

	/********************************************************************************
		Important: days[i] finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date.
		The second one (days[i][1]) has the individual url visits from google.
		The third days[i][2] is an array containing the number of visits per site.
		
	*********************************************************************************/
	function getHistory(hours, days){

		var tempData = [];

		// 90 days because sadly Chrome only saves history for 90 days
		var startTime = new Date();
			startTime.setDate(startTime.getDate()-90);
			startTime.setHours(0);
			startTime.setMinutes(0);
			startTime.setSeconds(0);
			startTime.setMilliseconds(0);
		var endTime = new Date();
			endTime.setDate(endTime.getDate()+1);
			endTime.setHours(0);
			endTime.setMinutes(0);
			endTime.setSeconds(0);
			endTime.setMilliseconds(0);

		// Counter for asynch chrome function
		var countTime = new Date();
			countTime.setTime(startTime.getTime());

		var d = new Date();
			d.setTime(startTime.getTime());

		for(d; d<= endTime; d.setTime(d.getTime()+hourMs)){
			var interval = new Date();
				interval.setTime(d.getTime()+hourMs);

			chrome.history.search({
			'text':'',
			'startTime': d.getTime(),
			'endTime':  interval.getTime(),
			'maxResults': 9999999
			},
			function(historyItems){
				tempData.push(historyItems);
				if (countTime >= endTime){
					arrayFromHistory(tempData, hours, hourMs, startTime);

					// Converting the hours to the days var
					hoursToDays(hours,days);
					notifyObservers('dataReady');

					// Fill both the search arrays
					searchDays("");
					searchHours("");

					// settign selectedItem to today, also bit dirty
					setSelectedItem(days[days.length-2]);
				}
				else{
					countTime.setTime(countTime.getTime()+hourMs);
				}
			});
		}
	}

	function arrayFromHistory(historyData, targetArray, timeUnit, startTime){

		var d = new Date(startTime.getTime());

		for(i = 0; i < historyData.length; i++){

			var count = createSiteCount(historyData[i]);
			
			targetArray.push([new Date(d.getTime()),historyData[i],count]);
			d.setTime(d.getTime()+timeUnit);
			
		}
	}

	function searchHistory(string, inside)
	{
		var data = [];
		for (i = 0; i<inside.length; i++)
		{
			var item = [];
			item.push(inside[i][0]);

			var result = inside[i][1].filter(function(d)
			{
				if(d['url'].indexOf(string.toLowerCase())>=0 || d['title'].indexOf(string.toLowerCase())>=0)
				{
					return d;
				}
			});
			item.push(result);
			
			data.push(item);
		}		
		return data;
	}

	function searchDays(string)
	{
		daysSearch = searchHistory(string, days);
		notifyObservers('searchDaysComplete');
	}

	function searchHours(string)
	{
		hoursSearch = searchHistory(string, hours);
		notifyObservers('searchHoursComplete');
	}

	// Helper functions
	function toJSON(history){
		var json = {};
		for(i=0; i < history.length; i++){
			json[Math.round(history[i][0].getTime()/1000)] = history[i][1].length;
		}
		return json;
	}

	function hoursToDays(h,d){
		d.length = 0;
		var day = new Array();
		var combinedHours = new Array();
		
		for(i=0; i<h.length; i++)
		{
			if(i==0)
			{
				day.push(h[i][0]);
			}

			if(h[i][1].length > 0)
			{
				for(j=0; j<h[i][1].length; j++)
				combinedHours.push(h[i][1][j]);
			}

			if((i+1)%24==0)
			{
				day.push(combinedHours);
				day.push(createSiteCount(combinedHours));
				d.push(day);

				var day = new Array();
				var combinedHours = new Array();

				day.push(h[i+1][0]);
			}
		}
	}

	function createSiteCount(data)
	{
		var urlArray = new Array();

		// Getting the starting of the url
		for(j = 0; j<data.length; j++){
			var url = $('<a>').prop('href',data[j].url).prop('hostname');
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

		return countsNormalArray;
	}

	// Setters
	function setSelectedItem(item){
		selectedItem = item;
		notifyObservers('itemSelected');
	}

	function setCurrentStats(stats){
		currentStats = stats;
		notifyObservers('dayStats');
	}

	function setCurrentView(string){
		currentView = string;
	}

	function setDaysSearch(value)
	{
		daysSearch = value;
	}

	// Getters
	function getDays(){
		return days;
	}

	function getMax(history)
	{
		var max = 0;
		for(i = 0; i < history.length; i++){
			if(history[i][1].length > max){
				max = history[i][1].length;
			}
		}
		return max;
	}

	function getDailyMax(){
		return getMax(days);
	}

	function getDaysSearchMax(){
		return getMax(daysSearch);
	}

	function getHourlyMax(){
		return getMax(hours);
	}

	function getHoursSearchMax(){
		return getMax(hoursSearch);
	}

	function getCurrentStats(){
		return currentStats;
	}

	function getDaysSearch()
	{
		return daysSearch;
	}

	function getHoursSearch()
	{
		return hoursSearch;
	}

	function getSelectedItem()
	{
		return selectedItem;
	}

	function getCurrentView()
	{
		return currentView;
	}

	// fill them once
	getHistory(hours,days);

	setCurrentView("monthCalendar");
	//searchDays("");

	this.days = days;
	this.hours = hours;

	this.searchDays = searchDays;
	this.searchHours = searchHours;

	this.getDaysSearch = getDaysSearch;
	this.getHoursSearch = getHoursSearch;

	this.getDailyMax = getDailyMax;
	this.getDaysSearchMax = getDaysSearchMax;
	this.getHourlyMax = getHourlyMax;
	this.getHoursSearchMax = getHoursSearchMax;

	this.toJSON = toJSON;
	this.hoursToDays = hoursToDays;

	this.setCurrentStats = setCurrentStats;
	this.getCurrentStats = getCurrentStats;

	this.setSelectedItem = setSelectedItem;
	this.getSelectedItem = getSelectedItem;

	this.getCurrentView = getCurrentView;
	this.setCurrentView = setCurrentView;

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