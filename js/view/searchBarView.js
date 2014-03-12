var SearchBarView = function(container,model)
{
	// Searchform
	var form = $("<div id='searchBar'>");
	var searchInput = $("<input type='text' class='form-control' placeholder='Filter History'>");
	var removeInput = $("<i class='glyphicon glyphicon-remove'>");
	form.append(searchInput,removeInput);

	//this.searchButton = searchButton;
	this.searchInput = searchInput;
	this.removeInput = removeInput;

	container.append(form);
}