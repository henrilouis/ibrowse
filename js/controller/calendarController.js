var CalendarController = function(view,model)
{
	view.searchInput.keyup(function(){
		model.searchDays(view.searchInput.val());
	});

	view.removeInput.click(function(){
		view.searchInput.val("");
		model.searchDays(view.searchInput.val());
	});
}