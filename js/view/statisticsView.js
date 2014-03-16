var StatisticsView = function(container,model)
{	
	var statisticsBox = $("<div id='statisticsBox'>");
	
	function updateDayData()
	{	
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

	  	var statisticsBoxTitle =	$("<div>"); 
		var topSitesBox = 			$("<div id='topSitesBox'>");
		var topSitesList = 			$("<div id='topSitesList'>");
	  	var graphsBox = 			$("<div id='graphsBox'>");
	  	var piechartBox = 			$("<div id='piechart'>");
	  	var topSitesBoxTitle = 		$("<h5 id='topSitesBoxTitle'>"); 
	  	var topSitesVisitsTitle = 	$("<div id='topSitesVisitsTitle'>");
		var color = d3.scale.category20();
	  	
	  	statisticsBoxTitle.html("General browsing statistics");
	  	topSitesBoxTitle.html("<b>Top 10 most visited sites:</b>");
	  	topSitesVisitsTitle.html("<b>visits:</b>");
	  	topSitesList.append(topSitesVisitsTitle)
	  	graphsBox.append(piechartBox);
	   	
	   	for(i=0; i<topData.length-1; i++)
	  	{	
	  		var legendaBlock = 		$("<div class='legendaBlock'>");
	  		var topSitesURL = 		$("<div class='topSitesURL'>");
	  		var topSitesVisits = 	$("<div class='topSitesVisits'>");
	  		topSitesURL.html(topData[i][0]+": ");
	  		topSitesVisits.html(topData[i][1]);
	  		legendaBlock.html(" ");
	  		topSitesList.append(legendaBlock,topSitesURL,topSitesVisits);
	  		legendaBlock.attr("style", "background-color:"+color(i));
	  	}
	  	
	  	topSitesBox.append(topSitesBoxTitle,graphsBox,topSitesList);
	  	
	   	/*****************************************  
		  		Append items to statisticsBox  
		*****************************************/
	   	statisticsBox.append(statisticsBoxTitle,topSitesBox);
 
		var piechartView = new PiechartView(container,model,topData);
	}
	
	function updateHourData()
	{
		var totalVisitedPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var hourNumber =0;
		
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
	  	var retrievedDay = 0;
	 	
	 	//check whether day 0 is a monday and set loop to start at first monday
	 	for(i=0; i<6;i++)
	 	{	
	 		var retrievedString = model.days[i][0].toString();
	 		var retrievedDay = (retrievedString.indexOf('Mon') > -1); //true
	 		if(retrievedDay == true){
	 			alert("day "+i+" is monday");
	 			dayNumber = i;
	 		}
	 	}

	 	//for the last 12 weeks sum all visits of each weekday
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

		var hourlyVisitsBox = 	$("<div id='hourlyVisitsBox'>");	 	
	 	var hourlyVisitsTitle = $("<h5>");
	 	var barGraphBox = 		$("<div id='bargraph'>");
	 	var sortButtonContainer=$("<div id='sortButtonContainer'>");
	 	var viewButtonContainer=$("<div id='viewButtonContainer'>");
		var sortButton = 		$("<input type='checkbox' id='sortButton'>");
		var viewButton = 		$("<input type='checkbox' id='viewButton'>");
		var sortButtonText = 	$("<div id='dayButtonText'>"); 
		var viewButtonText = 	$("<div id='viewButtonText'>"); 
		
		hourlyVisitsTitle.html("<b style='float: left'> Total hourly/dayly visits:</b>");
	  	sortButtonText.html(" Sort by visits");
	  	viewButtonText.html(" Hour/Day  ");

		sortButtonContainer.append(sortButtonText,sortButton);
		viewButtonContainer.append(viewButtonText,viewButton);
		barGraphBox.append(sortButtonContainer,viewButtonContainer);
 
	  	hourlyVisitsBox.append(hourlyVisitsTitle,barGraphBox);

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