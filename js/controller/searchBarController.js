var SearchBarController = function(view,model)
{	
	$("#weekcal").hide();
	$("#daycal").hide();

	view.searchInput.keyup(function(){

		if(model.getCurrentView() == "dayCalendar")
		{
			model.searchHours(view.searchInput.val());
		}
		else if(model.getCurrentView() == "weekCalendar")
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
		else if(model.getCurrentView() == "weekCalendar")
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
		$("#cal, #weekcal, #daycal, #statistics").hide();

		$(view.monthButton).removeClass('active');
		$(view.weekButton).removeClass('active');
		$(view.dayButton).removeClass('active');
		$(view.statsButton).removeClass('active');
	}

	view.monthButton.click(function(){
		model.setCurrentView("monthCalendar");
		model.searchDays(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#cal").show();
		$("#history").show();
	})

	view.weekButton.click(function(){
		model.setCurrentView("weekCalendar");
		model.searchHours(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#weekcal").show();
		$("#history").show();
	})

	view.dayButton.click(function(){
		model.setCurrentView("dayCalendar");
		model.searchHours(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#daycal").show();
		$("#history").show();
	})

	view.statsButton.click(function(){
		model.setCurrentView("statistics");
		hideAll();
		$(this).addClass("active");
		$("#history").hide();
		$("#statistics").show();
	})
}