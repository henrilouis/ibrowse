$(function()
{
	var ibrowseModel = new IbrowseModel();
	
	// Important to use a timeout function, because the request to the
	// model works asynchronously.

	setTimeout(function(){
		var date = new Date();
		date.setMonth(date.getMonth()-1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);

		console.log(ibrowseModel.month);
		for(i = 0; i < ibrowseModel.month.length; i++)
		{
			l = $("<p>");
			l.append(date);
			l.append("Visits:"+ibrowseModel.month[i].length);
			$('#calendar').append(l);
			date.setDate(date.getDate()+1);
		}
		
	},3000);
	
});