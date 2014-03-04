var CalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	var months = 6;
	var startDate = new Date();
		startDate.setMonth(startDate.getMonth()-months);
	var endDate = new Date(Date.now());

	// Buttons
	var nextButton = $("<button id='nextButton'>");
	var previousButton = $("<button  id='previousButton'>");

	container.append(nextButton,previousButton);

	model.getDays(startDate,endDate);

	function createCalendar(){
		var JSONdata = model.getDaysJSON();

		cal.init({
			data: JSONdata,
			itemSelector: container.selector,
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
				alert(date+value);
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