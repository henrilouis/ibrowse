var CalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	var calContainer = $("<div id='cal'>");
	container.append(calContainer);

	// Buttons
	var nextButton = $("<button class='nextButton glyphicon glyphicon-chevron-right'>");
	var previousButton = $("<button class='previousButton glyphicon glyphicon-chevron-left'>");
	container.append(nextButton,previousButton);

	// Searchform
	var form = $("<form class='form-inline' id='searchBar' role='form'>");
	var label = $("<label class='sr-only' for='searchHistory'>");
	var searchInput = $("<input type='text' class='form-control' placeholder='Search History'>");
	var searchButton = $("<button type='submit' class='btn btn-default'>Search</button>");

	form.append(label,searchInput,searchButton);
	container.append(form);
	// Creating startdate wich is 90 days back because of google
	startDate = new Date(Date.now());
	startDate.setDate(startDate.getDate()-90);

	function createCalendar(data){

		var max = model.getDailyMax();

		cal.init({
			data: data,
			itemSelector: "#cal",
			domain: "month",
			subDomain: "day",
			cellSize: 40,
			cellPadding:2,
			tooltip: true,
			legendHorizontalPosition: "center",
			itemName: "site",
			domainGutter: 20,
			legendCellSize: 20,
			range: 4,
			start: startDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value)
			{
				// Already created the request for the date, here d is the 
				// day object belonging to the clicked date. It has all the
				// visit counts etc.
				 
				var tmpday = model.days.filter(function(d)
					{ 
						if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) ) return d;
					})
				var day = tmpday[0];
				var visits = day[2];
				
				model.setCurrentStats(visits);
			}
		});

	}
		

	this.nextButton = nextButton;
	this.previousButton = previousButton;
	this.cal = cal;
	
	this.searchButton = searchButton;
	this.searchInput = searchInput;

	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'dataReady')
		{
			createCalendar(model.toJSON(model.days));
			//cal.update(model.toJSON(model.searchDays('kth')));
		}
	}

}