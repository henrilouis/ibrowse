var CalendarView = function(container,model)
{
	// Month calendar
	var calContainer = $("<div id='cal'>");
	var monthCalendarView = new MonthCalendarView(calContainer,model);
	var monthCalendarController = new MonthCalendarController(monthCalendarView,model);

	container.append(calContainer);
}