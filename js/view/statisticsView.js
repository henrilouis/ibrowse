var StatisticsView = function(container,model)
{	
	
	function update()
	{	
		var statisticsBox = $("<div id='statisticsBox'>");
		var topSitesBox = $("<div id='topSitesBox'>");
	  	var graphsBox = $("<div id='graphsBox'>");
	  	var piechartBox = $("<div id='piechart'>");
			  	
	  	statisticsBox.empty();

		var totalVisited = 0;
		var totalVisitedPerSite = new Array();
		var totalVisitedPerSiteURL = new Array();

		totalVisitedPerSite = [];
		totalVisitedPerSiteURL =[];
		// Get top 5 and count the rest to other
	 	var otherCount = 0;
	 	var topData = [];

	 	for (i=0; i<model.days.length; i++)
	 	{
	 		totalVisited += model.days[i][1].length;

	 		for(j=0; j<model.days[i][2].length; j++)
	 		{	
	 			var urlLocation = totalVisitedPerSiteURL.indexOf(model.days[i][2][j][0]);
				if(urlLocation > -1)
				{
					totalVisitedPerSite[urlLocation][1] += model.days[i][2][j][1];	
				}
				else
				{	
					totalVisitedPerSite.push(model.days[i][2][j]);
					totalVisitedPerSiteURL.push(model.days[i][2][j][0]);
				}
 			}
	 	}

	 	totalVisitedPerSite.sort(function(a,b){
   		 return  b[1] - a[1];
		});

		for (i = 0; i< totalVisitedPerSite.length; i++)
	 	{
	  	  	if(i<10)
		  	{
		  		topData.push(totalVisitedPerSite[i]);
		  	}
		  	else if (i < totalVisitedPerSite.length-1)
		  	{
		  		otherCount += totalVisitedPerSite[i][1];
		  	}
		  	else
		  	{
		  		otherCount += totalVisitedPerSite[i][1];
		  		topData.push(["Other",otherCount]);
		  	}
	  	}

	  	var topSitesBoxTitle = $("<h4>"); 
	  	topSitesBoxTitle.html("Top 10 most visited sites:");
	  	topSitesBox.append(topSitesBoxTitle);
	  	
	   	for(i=0; i<topData.length; i++)
	  	{
	  		var topSitesURL  = $("<div id='topSitesURL'>");
	  		var topSitesVisits  = $("<div id='topSitesVisits'>");
	  		topSitesURL.html(topData[i][0]+": ");
	  		topSitesVisits.html(topData[i][1]);
	  		topSitesBox.append(topSitesURL);
	  		topSitesBox.append(topSitesVisits);
	  	}	
	  	
	  	topSitesURL.html("Other: ");
	  	topSitesVisits.html(otherCount);
	  	topSitesBox.append(topSitesURL);
	  	topSitesBox.append(topSitesVisits);

	  	var statisticsBoxTitle = $("<h2>"); 
	  	statisticsBoxTitle.html("General browsing statistics");
	  	statisticsBox.append(statisticsBoxTitle);
	  	
	  	
	   	//statisticsBox.append(totalVisitedContainer);
	   	graphsBox.append(piechartBox);
	   	statisticsBox.append(topSitesBox);
	   	statisticsBox.append(graphsBox);
	  	
		  	
	  	/*****************************************  
		  			Append items to container  
		*****************************************/
		container.append(statisticsBox);
	
		var piechartView = new PiechartView(container,model,topData);
	
	}
	

	
	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'daysReady')
		{
			update();
		}
	}
 
}