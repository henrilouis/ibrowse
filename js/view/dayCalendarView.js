var DayCalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	
	// Buttons
	var nextButton = $("<button class='nextButton glyphicon glyphicon-chevron-right'>");
	var previousButton = $("<button class='previousButton glyphicon glyphicon-chevron-left'>");
	container.append(nextButton,previousButton);

	// Legend
	var dayLegend = $("<ul id='dayLegend'>");
	var weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	for(i=0; i<weekDays.length; i++)
	{
		var dayName = $("<li>");
		dayName.html(weekDays[i]);
		dayLegend.append(dayName);
	}

	var dayLegend2 = $("<ul id='dayLegend2'>");

	for(i=0; i<24; i++)
	{
		var hourName = $("<li>");
		hourName.html(i+":00");
		dayLegend2.append(hourName);
	}

	// Creating startdate wich is 90 days back because of google
	stDate = new Date(Date.now());
	stDate.setDate(stDate.getDate());

	function createCalendar(data){

		var max = model.getHourlyMax();
		var cSize = 27;

		cal.init({
			data: data,
			itemSelector: "#daycal",
			domain: "week",
			subDomain: "x_hour",
			cellSize: cSize,
			cellPadding:2,
			tooltip: true,
			legendHorizontalPosition: "center",
			displayLegend: false,
			itemName: "site",
			domainGutter: 0,
			rowLimit:24,
			legendCellSize: 10,
			domainMargin: [0, 0, 0, 35],
			range: 1,
			start: stDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value,rect)
			{
				$('#daycal rect').css('stroke','none');
				$('#daycal rect').attr('height',cSize).attr('width',cSize);
				
				// Also resetting the selection on the other calendar
				$('#cal rect').attr('height',30).attr('width',30);

				$(rect).css('stroke','rgba(0,255,0,1)');
				$(rect).attr('height',cSize-1).attr('width',cSize-1);

				var hour = model.hours.filter(function(d)
				{ 
					if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) && (d[0].getHours() == date.getHours()) ) return d;
				})

				model.setCurrentStats(hour[0][2]);

				if(model.getHoursSearch()!= "")
				{
					var item = model.getHoursSearch().filter(function(d)
					{ 
						if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) && (d[0].getHours() == date.getHours()) ) return d;
					})

					model.setSelectedItem(item[0]);
				}

				
			}
		});

	}
	
	// Append all items to the container
	this.nextButton = nextButton;
	this.previousButton = previousButton;
	this.cal = cal;

	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'hoursReady')
		{	
			container.append(dayLegend,dayLegend2);
			createCalendar(model.toJSON(model.hours));
		}

		else if(args == 'searchHoursComplete')
		{
			// Update the calendar with the new search data
			var data = model.toJSON(model.getHoursSearch());
			cal.update(data);
			cal.options.data = data;
			
			// Set the legend to the new max value
			var max = model.getHoursSearchMax();
			cal.setLegend([Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)]);
		}
	}
}