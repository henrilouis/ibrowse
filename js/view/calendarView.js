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
		var max = model.getDailyMax();
		console.log(max);

		cal.init({
			data: JSONdata,
			itemSelector: "#cal",
			domain: "month",
			subDomain: "day",
			cellSize: 40,
			cellPadding:2,
			tooltip: true,
			itemName: "site",
			domainGutter: 20,
			range: 4,
			start: startDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value)
			{
				// Already created the request for the date, here d is the 
				// day object belonging to the clicked date. It has all the
				// visit counts etc.
				 
				var tmpday = model.days.filter(function(d){ if(d[0] == String(date)) return d})
				var day = tmpday[0];

				console.log(day);
				var visits = day[2];
				
				// This visits data can be used in the treemap and this should
				// be updated here when the button is pressed.

				for(i = 0; i < visits.length; i++)
				{
					console.log(visits[i][0]+" : "+visits[i][1]);
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