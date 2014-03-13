var MonthCalendarView = function(container,model)
{
	// Calendar variables
	var cal = new CalHeatMap();
	
	// Buttons
	var nextButton = $("<button class='nextButton glyphicon glyphicon-chevron-right'>");
	var previousButton = $("<button class='previousButton glyphicon glyphicon-chevron-left'>");
	container.append(nextButton,previousButton);

	// Creating startdate wich is 90 days back because of google
	startDate = new Date(Date.now());
	startDate.setDate(startDate.getDate()-90);

	function createCalendar(data){

		var max = model.getDailyMax();
		var cSize = 30;

		cal.init({
			data: data,
			itemSelector: "#cal",
			domain: "month",
			subDomain: "day",
			cellSize: cSize,
			cellPadding:2,
			tooltip: true,
			legendHorizontalPosition: "center",
			displayLegend: false,
			itemName: "site",
			domainGutter: 10,
			legendCellSize: 10,
			range: 4,
			start: startDate,
			legend: [Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)],
			onClick: function(date,value,rect)
			{
				$('rect').css('stroke','none');
				$('rect').attr('height',cSize).attr('width',cSize);

				$(rect).css('stroke','rgba(0,255,0,1)');
				$(rect).attr('height',cSize-1).attr('width',cSize-1);

				var day = model.days.filter(function(d)
				{ 
					if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) ) return d;
				})

				model.setCurrentStats(day[0][2]);

				if(model.getDaysSearch()!= "")
				{
					var item = model.getDaysSearch().filter(function(d)
					{ 
						if( (d[0].getMonth() == date.getMonth()) && (d[0].getDate() == date.getDate()) ) return d;
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
			createCalendar(model.toJSON(model.days));
		}

		else if(args == 'searchComplete')
		{
			// Update the calendar with the new search data
			cal.update(model.toJSON(model.getDaysSearch()));
			// Set the legend to the new max value
			var max = model.getDaysSearchMax();
			cal.setLegend([Math.round(max*0.2),Math.round(max*0.4),Math.round(max*0.6),Math.round(max*0.8)]);
		}
	}
}