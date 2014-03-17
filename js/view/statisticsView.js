var StatisticsView = function(container,model)
{	
	var color = d3.scale.category20();	
	var statisticsTitle =		$("<div id='statisticsTitle'>");

	statisticsTitle.html("Your browsing statistics");
	
	//top visited statistics
	var topSitesBox = 			$("<div id='topSitesBox'>");
	var piechart = 				$("<div id='piechart'>");
  	var topSitesList = 			$("<ul id='topSitesList'>");

  	topSitesBox.append(piechart,topSitesList);
	
  	//daily & hourly statistics
  	var visitsBox = 			$("<div id='visitsBox'>");	
  	var visitsTitle = 			$("<span id='visitsTitle'>"); 
  	var dailyBarGraphBox = 		$("<div id='dailyBargraph'>");
  	var hourlyBarGraphBox = 	$("<div id='hourlyBargraph'>");
	
	//buttons 
	var viewbuttonGroup =		$("<div class='btn-group'>")
	var daysButton = 			$("<button class='btn btn-default active' id='daysButton'>");
	var hoursButton = 			$("<button class='btn btn-default' id='hoursButton'>");

	daysButton.html("Days");
	hoursButton.html("Hours");
	
	var dailysortButtonContainer=	$("<div class='buttonContainer'>");
  	var hourlysortButtonContainer=	$("<div class='buttonContainer'>");
  	var dailySortButton = 		$("<input type='checkbox' id='dailySortButton'>");
 	var hourlySortButton = 		$("<input type='checkbox' id='hourlySortButton'>");
 	var sortButtonText = 		$("<b>");
	
	visitsTitle.html("Average visits per day/hour:");
  	sortButtonText=" Sort by visits";
  	
	dailysortButtonContainer.append(dailySortButton,sortButtonText);
	hourlysortButtonContainer.append(hourlySortButton,sortButtonText);
	viewbuttonGroup.append(hoursButton,daysButton);

	dailyBarGraphBox.append(dailysortButtonContainer);
	hourlyBarGraphBox.append(hourlysortButtonContainer);
	visitsBox.append(visitsTitle,viewbuttonGroup,dailyBarGraphBox,hourlyBarGraphBox);

 	/*****************************************  
	  		Append items to container  
	*****************************************/
	container.append(statisticsTitle,topSitesBox,visitsBox);

	function updateDayData()
	{	
		var totalVisited = 0;
		var totalVisitedPerSite = [];
		var totalVisitedPerSiteURL = [];
		
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

	  	var piechartView = new PiechartView(container,model,topData);

	  	for(i=0; i<topData.length-1; i++)
	  	{	
	  		var legendItem = 		$("<li class='legendItem'>");
	  		var legendColor = 		$("<div class='legendColor'>");
	  		var topSitesURL = 		$("<div class='topSitesURL'>");
	  		var topSitesVisits = 	$("<div class='topSitesVisits'>");
	  		topSitesURL.html(topData[i][0]);
	  		topSitesVisits.html(topData[i][1]);
	  		legendItem.append(legendColor,topSitesURL,topSitesVisits);
	  		topSitesList.append(legendItem);
	  		legendColor.attr("style", "background-color:"+color(i));
	  	}
	  	
		totalVisitedPerDay = [0,0,0,0,0,0,0];
	 	var dayNumber =0;
	  	var retrievedDay = 0;
	 	
	 	//check whether day 0 is a monday and set loop to start at first monday
	 	for(i=0; i<7;i++)
	 	{	
	 		var retrievedString = model.days[i][0].toString();
	 		var retrievedDay = (retrievedString.indexOf('Mon') > -1); //true
	 		if(retrievedDay == true){
	 			dayNumber = i;
	 		}
	 	}

	 	//for the last 12 weeks sum all visits of each weekday
	 	for (i=0; i<12; i++)
	 	{	
	 		for(j=0; j<7; j++)
	 		{	
	 			totalVisitedPerDay[j] += model.days[j+dayNumber][1].length
			}
			dayNumber +=7;
	 	}

	 	//make averages
	 	for (i=0; i<totalVisitedPerDay.length;i++){
	 		totalVisitedPerDay[i] = (totalVisitedPerDay[i]/12).toFixed(0);
	 	}

		var barGraphView = new BarGraphView(container,model,totalVisitedPerDay,1);
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

	 	//make averages
	 	for (i=0;i<totalVisitedPerHour.length;i++){
	 		totalVisitedPerHour[i] = (totalVisitedPerHour[i]/90).toFixed(1);
	 	}

	 	var barGraphView = new BarGraphView(container,model,totalVisitedPerHour,2);
	}

	this.daysButton = daysButton;
	this.hoursButton = hoursButton;	
	
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