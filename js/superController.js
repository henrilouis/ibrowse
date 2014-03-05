$(function()
{
	var model = new IbrowseModel();
	
	// Important to use a timeout function, because the request to the
	// model works asynchronously.

	var calendarView = new CalendarView($("#calendar"),model);
	var calendarController = new CalendarController(calendarView,model);
});