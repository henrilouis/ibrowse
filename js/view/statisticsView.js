var StatisticsView = function(container,model)
{	
	var statisticsBox = $("<div id='statisticsBox'>");
	
	function updateDayData()
	{	
		var statisticsBoxTitle = $("<h3>"); 
		var topSitesBox = $("<div id='topSitesBox'>");
	  	var graphsBox = $("<div id='graphsBox'>");
	  	var piechartBox = $("<div id='piechart'>");
	
	  	statisticsBoxTitle.html("General browsing statistics");
	  	
			  	
	  	statisticsBox.empty();

		var totalVisited = 0;
		var totalVisitedPerSite = new Array();
		var totalVisitedPerSiteURL = new Array();

		totalVisitedPerSite = [];
		totalVisitedPerSiteURL =[];
		
		// Get top 10 and count the rest to other
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
	  	topSitesBox.append(topSitesURL);
	  	topSitesBox.append(topSitesVisits);
	   	graphsBox.append(piechartBox);

	   	/*****************************************  
		  		Append items to statisticsBox  
		*****************************************/
	   	statisticsBox.append(statisticsBoxTitle);
	   	statisticsBox.append(topSitesBox);
	   	statisticsBox.append(graphsBox);
 
		var piechartView = new PiechartView(container,model,topData);
	}
	
	function updateHourData()
	{
		var totalVisitedPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var hourNumber =0;
		var hourlyVisitsBox = $("<div id='hourlyVisitsBox'>");
		var hoursBox = $("<div id='hoursBox'>"); 
		
		
		for (i=0; i<90; i++)
	 	{
	 		for(j=0; j<24; j++)
	 		{	
	 			for(k=0; k<model.hours[(j+hourNumber)][2].length; k++)
	 			{
	 				totalVisitedPerHour[j] += model.hours[(j+hourNumber)][2][k][1];
	 			} 							 
			}
			hourNumber +=24;
	 	}
	 	/*
	 	for(l=0;l<totalVisitedPerHour.length;l++)
	 	{
	 		var hourlyVisitsTime = $("<div id='hourlyVisitsTime'>");
	 		var hourlyVisits = $("<div id='hourlyVisits'>")
	 		hourlyVisitsTime.html(l+":00 :");
	 		hourlyVisits.html(totalVisitedPerHour[l]);
	 		hoursBox.append(hourlyVisitsTime);
			hoursBox.append(hourlyVisits);
	 	}
	 	*/
	 	
	 	var hourlyVisitsTitle = $("<h4>");
	 	var barGraphBox = $("<div id='bargraph'>");
	  	hourlyVisitsTitle.html("Total hourly visits");
	  	hourlyVisitsBox.append(hourlyVisitsTitle);
	  	//hourlyVisitsBox.append(hoursBox);
	  	hourlyVisitsBox.append(barGraphBox);
	
	 	/*****************************************  
		  		Append items to statisticsBox  
		*****************************************/
		statisticsBox.append(hourlyVisitsBox);

		var barGraphView = new BarGraphView(container,model,totalVisitedPerHour);

	}

	
	/*****************************************  
	  			Append items to container  
	*****************************************/
	container.append(statisticsBox);
	
	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'daysReady')
		{
			updateDayData();
		}

		if(args == 'hoursReady')
		{
			updateHourData();
		}
	}

 }