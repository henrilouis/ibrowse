var IbrowseModel = function() {

	var month = [];
	// Getting time in Unix timestamp to use in startTime
	// option because we only want one month.
	function updateMonth()
	{
		var now = new Date(Date.now());
		var date = new Date();

		now.setDate(now.getDate());
		date.setMonth(date.getMonth()-1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);

		for(var d = date; d <= now; d.setDate(d.getDate()+1))
		{
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
				month.push([d,historyItems]);
			});
		}
	}

	updateMonth();
	this.month = month;
}