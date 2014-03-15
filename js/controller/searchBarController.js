var SearchBarController = function(view,model)
{
	view.searchInput.keyup(function(){

		if(model.getCurrentView() == "dayCalendar")
		{
			model.searchHours(view.searchInput.val());
		}
		else if(model.getCurrentView() == "monthCalendar")
		{
			model.searchDays(view.searchInput.val());
		}

	});

	view.removeInput.click(function(){

		view.searchInput.val("");
		if(model.getCurrentView() == "dayCalendar")
		{
			model.searchHours(view.searchInput.val());
		}
		else if(model.getCurrentView() == "monthCalendar")
		{
			model.searchDays(view.searchInput.val());
		}

	});

	function hideAll()
	{
		$("#cal, #daycal, #statistics").hide();

		$(view.monthButton).removeClass('active');
		$(view.dayButton).removeClass('active');
		$(view.statsButton).removeClass('active');
	}

	view.monthButton.click(function(){
		model.searchDays(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#cal").show();
		model.setCurrentView("monthCalendar");
	})

	view.dayButton.click(function(){
		model.searchHours(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#daycal").show();
		model.setCurrentView("dayCalendar");
	})

	view.statsButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#statistics").show();
		model.setCurrentView("statistics");
	})
}