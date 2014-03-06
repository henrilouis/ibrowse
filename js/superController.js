$(function()
{
	var model = new IbrowseModel();
	
	// Important to use a timeout function, because the request to the
	// model works asynchronously.

	var calendarView = new CalendarView($("#calendar"),model);
	var calendarController = new CalendarController(calendarView,model);

	//var dayView = new DayView($("#daycalendar"),model);
	//var dayController = new DayController(dayView,model);

	var piechartView = new PiechartView($("#daystats"),model);
	var piechartController = new PiechartController(piechartView,model);

	$("#statistics").draggable({
		
	});
	
});