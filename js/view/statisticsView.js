var StatisticsView = function(container,model)
{	
	var statisticsBox = $("<div id='statisticsBox'>");
	
	function updateDayData()
	{	
		var statisticsBoxTitle =	$("<div>"); 
		var topSitesBox = 			$("<div id='topSitesBox'>");
	  	var graphsBox = 			$("<div id='graphsBox'>");
	  	var piechartBox = 			$("<div id='piechart'>");
	
	  	statisticsBoxTitle.html("General browsing statistics");

		var totalVisited = 0;
		var totalVisitedPerSite = new Array();
		var totalVisitedPerSiteURL = new Array();

		totalVisitedPerSite = [];
		totalVisitedPerSiteURL =[];
		
		// For each unique url create entry and add similar url counts
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

	 	var otherCount = 0;
	 	var topData = [];

	 	// Get top 10 and count the rest to other
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

	  	var topSitesBoxTitle = $("<h5>"); 
	  	topSitesBoxTitle.html("<b>"+"Top 10 most visited sites:"+"</b>");
	  	topSitesBox.append(topSitesBoxTitle);

	  	/*
	   	for(i=0; i<topData.length-1; i++)
	  	{
	  		var topSitesURL = 		$("<div id='topSitesURL'>");
	  		var topSitesVisits = 	$("<div id='topSitesVisits'>");
	  		topSitesURL.html(topData[i][0]+": ");
	  		topSitesVisits.html(topData[i][1]);
	  		topSitesBox.append(topSitesURL);
	  		topSitesBox.append(topSitesVisits);
	  	}	
	  	topSitesBox.append(topSitesURL,topSitesVisits);
	  	*/
	  	graphsBox.append(piechartBox);

	   	/*****************************************  
		  		Append items to statisticsBox  
		*****************************************/
	   	statisticsBox.append(statisticsBoxTitle,topSitesBox,graphsBox);
 
		var piechartView = new PiechartView(container,model,topData);
	}
	
	function updateHourData()
	{
		var totalVisitedPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var hourNumber =0;
		var hourlyVisitsBox = 	$("<div id='hourlyVisitsBox'>");
		
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

	 	totalVisitedPerDay = [0,0,0,0,0,0,0];
	 	var dayNumber =0;
	 	for (i=0; i<12; i++)
	 	{
	 		for(j=0; j<7; j++)
	 		{	
	 			for(k=0; k<model.days[(j+dayNumber)][2].length; k++)
	 			{
	 				totalVisitedPerDay[j] += model.days[(j+dayNumber)][2][k][1];
	 			} 							 
			}
			dayNumber +=7;
	 	}

	 	
	 	var hourlyVisitsTitle = $("<h5>");
	 	var barGraphBox = 		$("<div id='bargraph'>");
	  	hourlyVisitsTitle.html("<b style='float: left'> Total hourly visits</b>");
	  	hourlyVisitsBox.append(hourlyVisitsTitle);
	  	
		var sortButton = 		$("<input type='checkbox' id='sortButton'>");
		var viewButton = 		$("<input type='checkbox' id='viewButton'>");
		var sortButtonnText = 	$("<div id='dayButtonText'>"); 
		var viewButtonnText = 	$("<div id='viewButtonText'>"); 

	  	sortButtonnText.html(" Sort by visits");
	  	viewButtonnText.html(" Change view");
	  	barGraphBox.append(sortButtonnText,sortButton,viewButtonnText,viewButton);
		 
	  	hourlyVisitsBox.append(barGraphBox);

	 	/*****************************************  
		  		Append items to statisticsBox  
		*****************************************/
		statisticsBox.append(hourlyVisitsBox);

		var barGraphView = new BarGraphView(container,model,totalVisitedPerHour,totalVisitedPerDay);

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