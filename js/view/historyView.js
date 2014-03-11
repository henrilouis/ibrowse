var HistoryView = function(container,model)
{
	var historyList = $("<ul id='historyList'>");

	function updateHistory()
	{
		historyList.empty();
		var item = model.getSelectedItem();
		// Sort items by id
		item[1].sort(function(a,b)
		{
			return b.id-a.id;
		});

		for(i=0;i<item[1].length;i++)
		{
			var listItem = $("<li>");
			var linkBox = $("<div class='linkBox'>");
			var link = $("<a>");
			var baseUrlBox = $("<div class='baseUrlBox'>")
			var baseUrl = $('<a>').prop('href',item[1][i].url).prop('hostname');
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

			linkBox.append(link);
			listItem.append(linkBox);
			baseUrlBox.append("- "+baseUrl);
			listItem.append(baseUrlBox);
			historyList.append(listItem);
		}
	}

	container.append(historyList);

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