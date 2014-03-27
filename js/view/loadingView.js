var LoadingView = function(container,model)
{	
	var barInner 		= $('<div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 25%">');
	var barOuter 		= $("<div class='progress progress-striped active'>");
		barOuter.append(barInner);
	var barContainer 	= $("<div id='loadingContainer'>");
		barContainer.append(barOuter);
	
	this.barInner = barInner;
	container.append(barContainer);

		// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == "dataReady")
		{
			barInner.css('width',"100%");
			container.fadeOut(1200);
		}
	}
}