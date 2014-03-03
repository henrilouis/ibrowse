$(function()
{
	var ibrowseModel = new IbrowseModel();
	
	// Important to use a timeout function, because the request to the
	// model works asynchronously.

	setTimeout(function(){

		console.log(ibrowseModel.month);
		for(i = 0; i < ibrowseModel.month.length; i++)
		{
			l = $("<p>");
			l.html(ibrowseModel.month[i][0]+ibrowseModel.month[i][1].length);
			$('#calendar').append(l);
		}

	},3000);
	
});