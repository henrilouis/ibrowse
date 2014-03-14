var DayCalendarController = function(view,model)
{
	view.nextButton.click(function(){
		view.cal.next(5);
	});

	view.previousButton.click(function(){
		view.cal.previous(5);
	});
}