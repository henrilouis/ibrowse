var DayCalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	var dayCalContainer = $("<div id='dayCalContainer'>");
	
	// Buttons
	var nextButton = $("<button class='nextButton glyphicon glyphicon-chevron-right'>");
	var previousButton = $("<button class='previousButton glyphicon glyphicon-chevron-left'>");
	container.append(nextButton,previousButton);

	// Legend
	var hourLegend = $("<ul id='hourLegend'>");
		for(i=0; i<24; i++)
	{
		var timebox = $("<li>");
		var hourName = $("<div style='text-align: right'>");
		hourName.html(i);
		timebox.append(hourName);
		hourLegend.append(timebox);
	}


	// stDate is the date the calender shows at start
	stDate = new Date(Date.now());
	stDate.setDate(stDate.getDate()-60);

	function createCalendar(data){

		var max = model.getHourlyMax();
		var cSize = 10;

		cal.init({
			data: data,
			itemSelector: "#dayCalContainer",
			domain: "month",
			subDomain: "hour",
			cellSize: cSize,
			cellPadding:2,
			tooltip: true,
			legendHorizontalPosition: "center",
			displayLegend: false,
			itemName: "site",
			domainGutter: 5,
			rowLimit:24,
			legendCellSize: 10,
			range: 2,
			start: stDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value,rect)
			{
				$('#daycal rect').css('stroke','none');
				$('#daycal rect').attr('height',cSize).attr('width',cSize);
				
				// Also resetting the selection on the other calendar
				$('#cal rect').attr('height',30).attr('width',30);
				$('#weekcal rect').attr('height',27).attr('width',27);

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
		if(args == 'dataReady')
		{	
			container.append(hourLegend);
			container.append(dayCalContainer);
			createCalendar(model.toJSON(model.hours));
		}

		else if(args == 'searchHoursComplete' && model.getCurrentView() == "dayCalendar")
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