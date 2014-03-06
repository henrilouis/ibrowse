$(function()
{
	var model = new IbrowseModel();
	
	// Important to use a timeout function, because the request to the
	// model works asynchronously.

	var calendarView = new CalendarView($("#calendar"),model);
	var calendarController = new CalendarController(calendarView,model);
	var historyView = new HistoryView($("#history"),model);
	var historyController = new HistoryController(historyView,model);

	//var dayView = new DayView($("#daycalendar"),model);
	//var dayController = new DayController(dayView,model);

	var dayStatsView = new DayStatsView($("#daystats"),model);
	var dayStatsController = new DayStatsController(dayStatsView,model);

	$("#statistics").draggable({
		
	});
	
});