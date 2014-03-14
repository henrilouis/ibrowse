var SearchBarController = function(view,model)
{
	view.searchInput.keyup(function(){
		model.searchDays(view.searchInput.val());
		model.searchHours(view.searchInput.val());
	});

	view.removeInput.click(function(){
		view.searchInput.val("");
		model.searchDays(view.searchInput.val());
		model.searchHours(view.searchInput.val());
	});

	function hideAll()
	{
		$("#cal, #daycal, #statistics").hide();

		$(view.monthButton).removeClass('active');
		$(view.dayButton).removeClass('active');
		$(view.statsButton).removeClass('active');
	}

	view.monthButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#cal").show();
	})

	view.dayButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#daycal").show();
	})

	view.statsButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#statistics").show();
	})
}