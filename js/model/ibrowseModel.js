var IbrowseModel = function() {

	var history = [];

	// Getting time in Unix timestamp to use in startTime
	// option because we only want one month.
	var date = new Date();
	date.setMonth(date.getMonth()-1);
	var time = date.getTime();

	chrome.history.search({
	'text':'',
	'startTime': time,
	'maxResults': 99999
	},
	function(historyItems){
		$.each(historyItems, function(index, val) {
			history.push(val);
		});
	});

	this.history = history;
}