$(function()
{
	var model = new IbrowseModel();

	var calendarView = new CalendarView($("#calendar"),model);
	var calendarController = new CalendarController(calendarView,model);
	
	var searchBarView = new SearchBarView($("#search"),model);
	var searchBarController = new SearchBarController(searchBarView,model);

	var historyView = new HistoryView($("#history"),model);
	var historyController = new HistoryController(historyView,model);

	/*
	var piechartView = new PiechartView($("#statistics"),model);
	var piechartController = new PiechartController(piechartView,model);

	$("#statistics").draggable({
		
	});*/
	
});