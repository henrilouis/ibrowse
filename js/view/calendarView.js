var CalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	var calContainer = $("<div id='cal'>");
	container.append(calContainer);

	// Buttons
	var nextButton = $("<button id='nextButton'>");
	var previousButton = $("<button  id='previousButton'>");
	container.append(nextButton,previousButton);

	// Creating startdate wich is 90 days back because of google
	startDate = new Date(Date.now());
	startDate.setDate(startDate.getDate()-90);

	function createCalendar(){
		var JSONdata = model.getDaysJSON();

		cal.init({
			data: JSONdata,
			itemSelector: "#cal",
			domain: "month",
			subDomain: "day",
			cellSize: 40,
			cellPadding:2,
			tooltip: true,
			domainGutter: 20,
			range: 4,
			start: startDate,
			legend: [100, 200, 300, 400],
			onClick: function(date,value)
			{
				// Already created the request for the date, here d is the 
				// day object belonging to the clicked date. It has all the
				// visit counts etc. check console for results from loop
				 
				var tmpday = model.days.filter(function(d){ if(d[0] == String(date)) return d})
				var day = tmpday[0];

				var visits = day[2];
				console.log(day);

				for(var website in visits)
				{
					console.log(website+" : "+visits[website]);
				}

				
			}
		});

	}

	this.nextButton = nextButton;
	this.previousButton = previousButton;
	this.cal = cal;

	// Observer Pattern

	model.addObserver(this);

	this.update = function(args)
	{
		createCalendar();
	}

}