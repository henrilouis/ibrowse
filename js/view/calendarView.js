var CalendarView = function(container,model)
{
	var cal = new CalHeatMap();

	var months = 5;
	var startDate = new Date();
		startDate.setMonth(startDate.getMonth()-months);
	var endDate = new Date(Date.now());

	model.getDays(startDate,endDate);

	setTimeout(function(){

		var JSONdata = model.getDaysJSON();

		cal.init({
			data: JSONdata,
			itemSelector: container.selector,
			domain: "month",
			subDomain: "x_day",
			cellSize: 20,
			cellPadding:5,
			range: months+1,
			start: startDate,
			legend: [100, 200, 300, 400] 

		});

	},9000);
}