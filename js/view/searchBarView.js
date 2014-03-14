var SearchBarView = function(container,model)
{
	// Searchform
	var menuContainer = $("<div id='menuContainer'>");
	var form = $("<div id='searchBar'>");
	var searchInput = $("<input type='text' class='form-control' placeholder='Search History'>");
	var removeInput = $("<i class='glyphicon glyphicon-remove'>");
	form.append(searchInput,removeInput);

	// View navigation

	var buttonGroup = 		$("<div class='btn-group'>");
	var monthButton = 		$("<button class='btn btn-default active'>");
	var dayButton = 		$("<button class='btn btn-default'>");
	var statsButton	= 		$("<button class='btn btn-default'>");

	var monthSpan = 		$("<span class='glyphicon glyphicon-th-large'>");
	var daySpan = 			$("<span class='glyphicon glyphicon-th'>");
	var statsSpan = 		$("<span class='glyphicon glyphicon-stats'>");

	monthButton.append(monthSpan);
	dayButton.append(daySpan);
	statsButton.append(statsSpan);

	buttonGroup.append(monthButton,dayButton,statsButton);
	
	menuContainer.append(form,buttonGroup);
	container.append(menuContainer);

	// Bindings to self
	this.searchInput = searchInput;
	this.removeInput = removeInput;
	this.monthButton = monthButton;
	this.dayButton = dayButton;
	this.statsButton = statsButton;
}