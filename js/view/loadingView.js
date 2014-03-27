var LoadingView = function(container,model)
{	
	var barContainer 	= $("<div class='loadingContainer'>");
	var barOuter 		= $("<div class='progress progress-striped active'>");
		barOuter.append(barInner);
	var barInner 		= $('<div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">');

	container.append(barOuter);
}