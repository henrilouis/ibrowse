var CalendarView = function(container,model)
{
	// Searchform
	var form = $("<div id='searchBar'>");
	var searchInput = $("<input type='text' class='form-control' placeholder='Filter History'>");
	var removeInput = $("<i class='glyphicon glyphicon-remove'>");
	form.append(searchInput,removeInput);

	// Month calendar
	var calContainer = $("<div id='cal'>");
	var monthCalendarView = new MonthCalendarView(calContainer,model);
	var monthCalendarController = new MonthCalendarController(monthCalendarView,model);

	//this.searchButton = searchButton;
	this.searchInput = searchInput;
	this.removeInput = removeInput;

	container.append(form);
	container.append(calContainer);
}