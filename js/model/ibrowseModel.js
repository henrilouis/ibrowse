var IbrowseModel = function() {

	var days = [];
	// Getting time in Unix timestamp to use in startTime
	// option because we only want one month.
	function getDays(startTime,endTime){

		var tempDays = [];
		var sT = new Date(startTime.getTime());
		sT.setHours(0);
		sT.setMinutes(0);
		sT.setSeconds(0);

		for(var d = sT; d <= endTime; d.setDate(d.getDate()+1)){

			var nextd = new Date(d.getTime());
			nextd.setDate(d.getDate()+1);
			//console.log(d,nextd);

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
			});
		}

		setTimeout(function(){

			var d = new Date(startTime.getTime());
			for(i = 0; i < tempDays.length; i++)
			{
				days.push([new Date(d.getTime()),tempDays[i]]);
				d.setDate(d.getDate()+1);
			}
		},8000);
	}

	function getDaysJSON(){

		var json = {};
		for(i=0; i < days.length; i++){
			json[Math.round(days[i][0].getTime()/1000)] = days[i][1].length;
		}
		return json;

	}

	this.getDays = getDays;
	this.days = days;
	this.getDaysJSON = getDaysJSON;
}