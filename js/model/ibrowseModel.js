var IbrowseModel = function() {

	var days = [];
	var hours = [];
	var currentStats;

	/********************************************************************************
		Important: days[i] finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date.
		The second one (days[i][1]) has the individual url visits from google.
		The third days[i][2] is an array containing the number of visits per site.
		
	*********************************************************************************/

	function fillDays(){
		days = [];
		var tempDays = [];

		// 90 days because sadly Chrome only saves history for 90 days
		var startTime = new Date();
			startTime.setDate(startTime.getDate()-90);
		var endTime = new Date(Date.now());

		var sT = new Date(startTime.getTime());
		var cT = new Date(startTime.getTime());
		sT.setHours(0);
		sT.setMinutes(0);
		sT.setSeconds(0);

		for(var d = sT; d <= endTime; d.setDate(d.getDate()+1)){

			var nextd = new Date(d.getTime());
			nextd.setDate(d.getDate()+1);

			chrome.history.search({
			'text':'',
			'startTime': d.getTime(),
			'endTime':  nextd.getTime(),
			'maxResults': 999999
			},
			function(historyItems)
			{
				//console.log(historyItems.length);
				tempDays.push(historyItems);
				if (cT >= endTime){
					// If it enters here the counting is done so the callback can be called
					pushDays();
				}else{
					cT.setDate(cT.getDate()+1);
				}
			});
		}

		function pushDays(){
			var d = new Date(startTime.getTime());
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			for(i = 0; i < tempDays.length; i++){

				var urlArray = new Array();

				// Getting the starting of the url
				for(j = 0; j<tempDays[i].length; j++){
					
					var url = $('<a>').prop('href',tempDays[i][j].url).prop('hostname');
					urlArray.push(url);
				}

				// Creating associative array from url count
				var counts = new Array();
				urlArray.forEach(function(x){ 
					counts[x] = (counts[x] || 0)+1; 
				});

				// Make a normal array out of the associative one
				var countsNormalArray = new Array();
				for(key in counts)
				{
					countsNormalArray.push([key,counts[key]]);
				}

				// Sorting the array in descending order
				countsNormalArray.sort(function(a,b)
				{
					return b[1]-a[1];
				});

				days.push([new Date(d.getTime()),tempDays[i],countsNormalArray]);
				d.setDate(d.getDate()+1);
			}
			notifyObservers('dataReady');
			//fillHours();
		}
	}

	function fillHours(){
		hours = [];
		var tempHours = [];

		// 90 days because sadly Chrome only saves history for 90 days
		var startTime = new Date();
			startTime.setDate(startTime.getDate()-3);
		var endTime = new Date(Date.now());

		var sT = new Date(startTime.getTime());
		var cT = new Date(startTime.getTime());

		for(var d = sT; d <= endTime; d.setHours(d.getHours()+1)){

			var nextd = new Date(d.getTime());
			nextd.setHours(d.getHours()+1);
			var stopbool = false;

			chrome.history.search({
			'text':'',
			'startTime': d.getTime(),
			'endTime':  nextd.getTime(),
			'maxResults': 999999
			},
			function(items)
			{
				//console.log(historyItems.length);
				tempHours.push(items);
				if (cT >= endTime){
					
					// If it enters here the counting is done so the callback can be called
					if(!stopbool) 
					{
						pushHours();
						stopbool = true;
					}
					console.log(cT+" "+endTime);
				}else{
					cT.setHours(cT.getHours()+1);
				}
			});
		}

		function pushHours(){
			var d = new Date(startTime.getTime());
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			for(i = 0; i < tempHours.length; i++){

				var urlArray = new Array();

				// Getting the starting of the url
				for(j = 0; j<tempHours[i].length; j++){
					
					var url = $('<a>').prop('href',tempHours[i][j].url).prop('hostname');
					urlArray.push(url);
				}

				// Creating associative array from url count
				var counts = new Array();
				urlArray.forEach(function(x){ 
					counts[x] = (counts[x] || 0)+1; 
				});

				// Make a normal array out of the associative one
				var countsNormalArray = new Array();
				for(key in counts)
				{
					countsNormalArray.push([key,counts[key]]);
				}

				// Sorting the array in descending order
				countsNormalArray.sort(function(a,b)
				{
					return b[1]-a[1];
				});

				hours.push([new Date(d.getTime()),tempHours[i],countsNormalArray]);
				d.setHours(d.getHours()+1);
			}
			notifyObservers('dataReady');
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


	function getDays()
	{
		return days;
	}

	function getDailyMax()
	{
		var max = 0;
		for(i = 0; i < days.length; i++){
			// Get the highest value per day to determine scale
			if(days[i][1].length > max){
				max = days[i][1].length;
			}
		}
		return max;
	}

	function getHourlyMax()
	{
		var max = 0;
		for(i = 0; i < hours.length; i++){
			// Get the highest value per day to determine scale
			if(hours[i][1].length > max){
				max = hours[i][1].length;
			}
		}
		return max;
	}

	function setCurrentStats(stats)
	{
		currentStats = stats;
		notifyObservers('dayStats');
	}

	function getCurrentStats()
	{
		return currentStats;
	}

	// fill them once
	fillDays();
	

	this.fillDays = fillDays;
	this.days = days;

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