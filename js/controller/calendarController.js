var CalendarController = function(view,model)
{
	view.nextButton.click(function(){
		view.cal.next();
	});

	view.previousButton.click(function(){
		view.cal.previous();
	});

	view.searchButton.click(function(e){
		e.preventDefault();
		view.cal.update(model.toJSON(model.searchDays(view.searchInput.val())));
	})
}