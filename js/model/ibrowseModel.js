var IbrowseModel = function() {

	var days = [];

	/********************************************************************************
		Important: days[i] finally contains three arrays per day.

		The first one (days[i][0]) is one with the day date
		The second one (days[i][1]) has the individual url visits from google
		The third days[i][1] is an associative array containingthe counted 
		visits per website. Remember, looping over asoc arrays
		only works with 
		for(var key in days[i][1]){ 
			
			dosomethingwith(	key, days[i][1][key]	)
		}	
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

				for(j = 0; j<tempDays[i].length; j++){
					
					var url = $('<a>').prop('href',tempDays[i][j].url).prop('hostname');
					urlArray.push(url);
				}

				var counts = new Array();
				urlArray.forEach(function(x){ 
					counts[x] = (counts[x] || 0)+1; 
				});

				days.push([new Date(d.getTime()),tempDays[i],counts]);
				d.setDate(d.getDate()+1);
			}
			notifyObservers();
		}
	}

	function getDaysJSON(){
		var json = {};
		for(i=0; i < days.length; i++){
			json[Math.round(days[i][0].getTime()/1000)] = days[i][1].length;
		}
		return json;
	}

	function getDays()
	{
		return days;
	}

	// fill them once
	fillDays();

	this.fillDays = fillDays;
	this.getDays = getDays;
	this.days = days;
	this.getDaysJSON = getDaysJSON;


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