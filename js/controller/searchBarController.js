var SearchBarController = function(view,model)
{	
	view.searchInput.keyup(function(){

		if(model.getCurrentView() == "dayCalendar")
		{
			// Setting interval so the daycal won't get slow
			if(interval != null)
			{
				clearTimeout(interval);
			}
			var interval = setTimeout(function(){
				model.search(view.searchInput.val());
			},1500)
		}
		else if(model.getCurrentView() == "weekCalendar" || model.getCurrentView() == "monthCalendar")
		{
			model.search(view.searchInput.val());
		}

	});

	view.removeInput.click(function(){

		view.searchInput.val("");
		if(model.getCurrentView() == "dayCalendar")
		{
			model.search(view.searchInput.val());
		}
		else if(model.getCurrentView() == "weekCalendar" || model.getCurrentView() == "monthCalendar")
		{
			model.search(view.searchInput.val());
		}
		
	});

	function hideAll(){
		$("#cal, #weekcal, #daycal, #statistics").hide();

		$(view.monthButton).removeClass('active');
		$(view.weekButton).removeClass('active');
		$(view.dayButton).removeClass('active');
		$(view.statsButton).removeClass('active');
	}

	view.monthButton.click(function(){
		model.setCurrentView("monthCalendar");
		model.search(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#cal").show();
		$("#history").show();
	})

	view.weekButton.click(function(){
		model.setCurrentView("weekCalendar");
		model.search(view.searchInput.val());
		hideAll();
		$(this).addClass("active");
		$("#weekcal").show();
		$("#history").show();
	})

	view.dayButton.click(function(){
		model.setCurrentView("dayCalendar");
		model.search(view.searchInput.val());
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