var CalendarController = function(view,model)
{
	view.nextButton.click(function(){
		view.cal.next();
	});

	view.previousButton.click(function(){
		view.cal.previous();
	});

	view.searchInput.keyup(function(){
		view.cal.update(model.toJSON(model.searchDays(view.searchInput.val())));
	});

	view.removeInput.click(function(){
		view.searchInput.val("");
		view.cal.update(model.toJSON(model.searchDays(view.searchInput.val())));
	});
}