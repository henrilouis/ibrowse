var IbrowseModel = function() {

	var history = [];

	var days = [];
	var hours = [];

	var lastSearchString = "";
	var daysSearch = [];
	var hoursSearch = [];
	var selectedItemSearch = [];

	var currentStats;
	var selectedItem;
	var currentView = "monthCalendar";

	var siteRanking = [];

	// milliseconds in one hour
	var hourMs 	= 3600000;
	var dayMs   = 86400000;

	/********************************************************************************
		Important: days[i]/hours[i] etc finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date.
		The second one (days[i][1]) has the individual url visits from chrome.
			And days[i][1][0] = the Unique ID
				days[i][1][1] = the URL
				days[i][1][2] = the Title
				days[i][1][3] = the Timestamp
		The third days[i][2] is an array containing the number of visits per site.
	*********************************************************************************/

	/*******************************
			Run on startup
	*******************************/
	getHistory();

	/*******************************
	   Getting the actual history
	   from Chrome
	*******************************/
	function getHistory()
	{
		history.length = 0;
		chrome.history.search({
			'text':'',
			'startTime':0,
			'maxResults': 9999999
		},function(historyItems){
			var itemsCount = 0;

			historyItems.forEach(function(historyItem){
				chrome.history.getVisits({url:historyItem.url},function(visitItems){
					visitItems.forEach(function(visitItem){
						var item = new Array();
						item.push(visitItem.visitId,historyItem.url,historyItem.title,visitItem.visitTime);
						history.push(item);
					});
					itemsCount++;
					if(itemsCount == historyItems.length){

						// Convert the raw data in time-unit based arrays
						historyPerTimeUnit(history,hourMs,hours);
						historyPerTimeUnit(history,dayMs,days);

						// Create the top list from the raw data
						siteRanking = createSiteCount(history);

						// Notify observers that the data is ready
						notifyObservers('dataReady');

						// Search for nothing so all arrays are filled
						setSelectedItem(days[days.length-1]);
					}
				});
			});
		});
	}

	function historyPerTimeUnit(history,timeUnit,target)
	{
		target.length = 0;

		var d = new Date();
			d.setDate(d.getDate()-90);
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			d.setMilliseconds(0);

		var endTime = new Date();
			endTime.setDate(endTime.getDate()+1);
			endTime.setHours(0);
			endTime.setMinutes(0);
			endTime.setSeconds(0);
			endTime.setMilliseconds(0);

		for(d; d<endTime; d.setTime(d.getTime()+timeUnit)){
			var unit = new Array();
			unit.push(new Date(d.getTime()));
			unit[1] = [];
			for(i=0; i < history.length; i++){
				if( (history[i][3] >= d.getTime()) && (history[i][3] < (d.getTime()+timeUnit)) ){
					unit[1].push(history[i]);
				}
			}
			unit.push(createSiteCount(unit[1]));
			target.push(unit);
		}
	}

	/*******************************
			Search Functions
	********************************/
	function searchHistory(string, inside){
		var data = [];
		for (i = 0; i<inside.length; i++){
			var item = [];
			item.push(inside[i][0]);
			var result = inside[i][1].filter(function(d){
				if(d[1].indexOf(string.toLowerCase())>=0 || d[2].indexOf(string.toLowerCase())>=0){
					return d;
				}
			});
			item.push(result);
			
			data.push(item);
		}		
		return data;
	}

	function search(string){

		// setting lastSearchString so it can be used again
		lastSearchString = string;
		daysSearch = searchHistory(string, days);
		hoursSearch = searchHistory(string, hours);
		selectedItemSearch = searchHistory(string, [selectedItem])[0];
		notifyObservers('searchComplete');
	}

	/*******************************
		Convert the normal array
		to JSON for d3 Calendar
		but only with visits.
	********************************/
	function toJSON(data){
		var json = {};
		for(i=0; i < data.length; i++){
			json[Math.round(data[i][0].getTime()/1000)] = data[i][1].length;
		}
		return json;
	}

	/*******************************
		Create top-sites for 
		single time unit.
	********************************/
	function createSiteCount(data){
		var urlArray = new Array();

		// Getting the starting of the url
		for(j = 0; j<data.length; j++){
			var url = $('<a>').prop('href',data[j][1]).prop('hostname');
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
			if(key != ""){
				countsNormalArray.push([key,counts[key]]);
			}
			else{
				countsNormalArray.push(["local files",counts[key]]);
			}
		}

		// Sorting the array in descending order
		countsNormalArray.sort(function(a,b){
			return b[1]-a[1];
		});

		return countsNormalArray;
	}

	/*******************************
		Remove url from current
		arrays so we dont need
		to reload
	********************************/
	function removeUrl(url)
	{
		removeFromArray(hours);
		removeFromArray(days);
		removeFromArray(daysSearch);
		removeFromArray(hoursSearch);

		function removeFromArray(array)
		{
			for(i=0;i<array.length;i++)
			{
				for(j=0;j<array[i][1].length;j++)
				{
					if(array[i][1][j][1] === url)
					{
						array[i][1].splice(j,1);
					}
				}
			}
		}
		notifyObservers('itemRemoved');
	}

	/*******************************
				Setters
	********************************/
	function setSelectedItem(item){
		selectedItem = item;
		search(lastSearchString);
	}

	function setCurrentView(string){
		currentView = string;
	}

	function setDaysSearch(value){
		daysSearch = value;
	}

	/*******************************
				Getters
	********************************/
	function getSiteRanking(){
		return siteRanking;
	}

	function getTop(){
		var ranking = getSiteRanking();
		var topData = [];
		var count = 0;
		for (i = 0; i< ranking.length; i++){
	  	  	if(i<10){
		  		topData.push(ranking[i]);
		  	}
		  	else if (i < ranking.length-1){
		  		count += ranking[i][1];
		  	}
		  	else{
		  		count += ranking[i][1];
		  		topData.push(["Other",count]);
		  	}
	  	}
	  	return topData;
	}

	function getDailyTop()
	{	
		var topData = getTop();
		var data = [];
		var count = [];
	  	for(i=0; i<topData.length ;i++)
	  	{
	  		data.push([0,0,0,0,0,0,0]);
	  		count = [0,0,0,0,0,0,0];

		   	for(j = 0; j<days.length; j++)
		   	{
		   		for(k=0;k<days[j][2].length;k++){
		 			if(days[j][2][k][0] == topData[i][0]){	
		 				data[i][days[j][0].getDay()] += days[j][2][k][1];
		 			}
		 		}
		 		count[days[j][0].getDay()] ++;
		   	}
		 	//make averages
		 	for (j=0; j<data[i].length;j++){
		 		data[i][j] = (data[i][j]/count[j]).toFixed(0);
		 	}
		 	// Javascript counts sunday as first weekday so splice it baby
	 		data[i].push(data[i].splice(0,1)[0]);
	  	}
	  	return data;
	}

	function getHourlyTop()
	{	
		var topData = getTop();
	 	var topHourlyDataPerSite =[];
	 
	 	for(i=0;i<topData.length;i++){	
	  		topHourlyDataPerSite.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
	  		var hourNumber2 = 0;
		
			for (j=0; j<90; j++){
		 		for(k=0; k<24; k++){	
		 			for(l=0;l<hours[k+hourNumber2][2].length; l++){	
			 			if (hours[k+hourNumber2][2][l][0] == topData[i][0]){	
			 				topHourlyDataPerSite[i][k] += hours[k+hourNumber2][2][l][1];
			 			}
		 			} 							 
				}
				hourNumber2 +=24;
		 	}
		 	//make averages
		 	for (m=0; m<topHourlyDataPerSite[i].length;m++){
		 		topHourlyDataPerSite[i][m] = (topHourlyDataPerSite[i][m]/90).toFixed(1);
		 	}
		 	
		}
		return topHourlyDataPerSite
	}

	function getDailyAverages()
	{
		var visits = [0,0,0,0,0,0,0];
		var count = [0,0,0,0,0,0,0];
		for(i = 0; i<days.length; i++)
		{
			visits[days[i][0].getDay()] += days[i][1].length;
			count[days[i][0].getDay()] ++;
		}
		
		for (i=0; i<visits.length;i++){
	 		visits[i] = (visits[i]/count[i]).toFixed(0);
	 	}
	 	// Javascript counts sunday as first weekday so splice it baby
	 	visits.push(visits.splice(0,1)[0]);
		return visits;
	}

	function getHourlyAverages()
	{
		var visits = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

		for(i = 0; i<hours.length; i++)
		{
			visits[hours[i][0].getHours()] += hours[i][1].length;
			count[hours[i][0].getHours()] ++;
		}
		
		for (i=0; i<visits.length;i++){
	 		visits[i] = (visits[i]/count[i]).toFixed(1);
	 	}
		return visits;
	}

	function getMax(history){
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

	function getDaysSearch(){
		return daysSearch;
	}

	function getHoursSearch(){
		return hoursSearch;
	}

	function getSelectedItemSearch(){
		return selectedItemSearch;
	}

	function getCurrentView(){
		return currentView;
	}

	function getLastSearchString(){
		return lastSearchString;
	}

	



	/*******************************
			Self Assignments
	********************************/
	this.days = days;
	this.hours = hours;

	this.search = search;

	this.getDaysSearch = getDaysSearch;
	this.getHoursSearch = getHoursSearch;
	this.getLastSearchString = lastSearchString;

	this.getDailyAverages = getDailyAverages;
	this.getHourlyAverages = getHourlyAverages;

	this.getSiteRanking = getSiteRanking;
	this.getTop = getTop;
	this.getDailyTop = getDailyTop;
	this.getHourlyTop = getHourlyTop;

	this.getDailyMax = getDailyMax;
	this.getDaysSearchMax = getDaysSearchMax;
	this.getHourlyMax = getHourlyMax;
	this.getHoursSearchMax = getHoursSearchMax;

	this.toJSON = toJSON;

	this.setSelectedItem = setSelectedItem;
	this.getSelectedItemSearch = getSelectedItemSearch;

	this.getCurrentView = getCurrentView;
	this.setCurrentView = setCurrentView;

	this.removeUrl = removeUrl;

	/*******************************
			   Observable
	********************************/
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