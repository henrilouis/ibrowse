var HistoryView = function(container,model)
{	
	var historyBox  = $("<div>");
	var historyTitle = $("<ul id='historyTitle'>");
	var historyList = $("<ul class='historyList'>");


	// Static variables for creating dates
	var monthNames = new Array("January", "February", "March", 
		"April", "May", "June", "July", "August", "September", 
		"October", "November", "December");

	var dayNames = new Array("Sunday","Monday","Tuesday","Wednesday",
		"Thursday","Friday","Saturday");

	function updateHistory()
	{
		historyList.empty();
		historyTitle.empty();
		var item = model.getSelectedItem();
		// Sort items by id
		item[1].sort(function(a,b)
		{
			return b.id-a.id;
		});

		// Creating date from timestamp
		var title = $("<li class='historyViewTitle'>");
		var day = dayNames[item[0].getDay()];
		var month = monthNames[item[0].getMonth()]
		var date = item[0].getDate();
		var year = item[0].getFullYear();
		title.html(day+", "+month+" "+date+", "+year);
		historyTitle.append(title);
		

		for(i=0;i<item[1].length;i++)
		{
			var listItem = $("<li>");

			var linkBox = $("<div class='linkBox'>");
			var link = $("<a>");

			var baseUrlBox = $("<div class='baseUrlBox'>")
			var baseUrl = $('<a>').prop('href',item[1][i].url).prop('hostname');

			var faviconBox = $("<div class='faviconBox'>");
			var favicon = $("<img>");
				favicon.prop('src',"chrome://favicon/http://"+baseUrl);

			if(item[1][i].title != "")
			{
				link.html(item[1][i].title);
			}
			else
			{
				link.html(item[1][i].url);
			}
				link.prop("href",item[1][i].url);
				link.prop("target","blank");

			faviconBox.append(favicon);
			listItem.append(faviconBox);
			
			linkBox.append(link);
			listItem.append(linkBox);
			baseUrlBox.append(baseUrl);
			listItem.append(baseUrlBox);
			historyList.append(listItem);
		}
	}
	historyBox.append(historyTitle);
	historyBox.append(historyList);

	container.append(historyBox);



	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == "itemSelected")
		{
			updateHistory();
		}
	}
}