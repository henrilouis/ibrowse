var CalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	var calContainer = $("<div id='cal'>");
	

	// Buttons
	var nextButton = $("<button class='nextButton glyphicon glyphicon-chevron-right'>");
	var previousButton = $("<button class='previousButton glyphicon glyphicon-chevron-left'>");
	container.append(nextButton,previousButton);

	// Searchform
	var form = $("<div id='searchBar'>");
	var searchInput = $("<input type='text' class='form-control' placeholder='Filter History'>");
	var removeInput = $("<i class='glyphicon glyphicon-remove'>");
	form.append(searchInput,removeInput);

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
			cellSize: 38,
			cellPadding:2,
			tooltip: true,
			legendHorizontalPosition: "center",
			itemName: "site",
			domainGutter: 10,
			legendCellSize: 20,
			range: 4,
			start: startDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value)
			{
				var day = model.days.filter(function(d)
				{ 
					if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) ) return d;
				})

				model.setCurrentStats(day[0][2]);
			}
		});

	}
	
	// Append all items to the container
	container.append(form);
	container.append(calContainer);

	this.nextButton = nextButton;
	this.previousButton = previousButton;
	this.cal = cal;

	//this.searchButton = searchButton;
	this.searchInput = searchInput;
	this.removeInput = removeInput;

	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'dataReady')
		{
			createCalendar(model.toJSON(model.days));
		}
	}

}