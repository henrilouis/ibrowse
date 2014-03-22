var StatisticsView = function(container,model)
{	
	var color = d3.scale.category20();	
	var statisticsTitle =		$("<h2>");
	var daysReady	=	false;
	var hoursReady	=	false;

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
  	var onDemandBarGraphBox = 	$("<div id='onDemandBargraph'>");
	
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
	visitsBox.append(visitsTitle,viewbuttonGroup,dailyBarGraphBox,hourlyBarGraphBox,onDemandBarGraphBox);

 	/*****************************************  
	  		Append items to container  
	*****************************************/
	container.append(statisticsTitle,topSitesBox,visitsBox);

	function updateData()
	{	
		var firstMonday = getFirstMonday();
		var totalVisited = 0;
		var totalVisitedPerSite = [];
		var totalVisitedPerSiteURL = [];
		
		// For each unique url create entry and add similar url counts
	 	for (i=0; i<model.days.length; i++){
	 		totalVisited += model.days[i][1].length;

	 		for(j=0; j<model.days[i][2].length; j++)
	 		{	
	 			var urlLocation = totalVisitedPerSiteURL.indexOf(model.days[i][2][j][0]);
				if(urlLocation > -1)
				{	
					var websitecount = model.days[i][2][j][1];
					totalVisitedPerSite[urlLocation][1] += websitecount;	
				}
				else
				{	
					totalVisitedPerSite.push([0,0]);
					totalVisitedPerSite[totalVisitedPerSite.length-1][0] = model.days[i][2][j][0];
					totalVisitedPerSite[totalVisitedPerSite.length-1][1] = model.days[i][2][j][1];
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

		for (i = 0; i< totalVisitedPerSite.length; i++){
	  	  	if(i<10){
		  		topData.push(totalVisitedPerSite[i]);
		  	}
		  	else if (i < totalVisitedPerSite.length-1){
		  		otherCount += totalVisitedPerSite[i][1];
		  	}
		  	else{
		  		otherCount += totalVisitedPerSite[i][1];
		  		topData.push(["Other",otherCount]);
		  	}
	  	}

	  	// Legend for pie-chart
	  	for(i=0; i<topData.length-1; i++){	
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

	  	// visited per day
	  	var totalVisitedPerDay = getVisitedPerDay(firstMonday);
	  	
	 	// to visited per day
	  	var topDailyDataPerSite = getTopDailyData(firstMonday,topData);

	  	// visited per hour
	  	var totalVisitedPerHour = getVisitedPerHour();

	  	// top visited per hour
	 	var topHourlyDataPerSite = getTopHourlyData(topData);


		// Create pie chart
	  	var piechartView = new PiechartView(container,model,topData,topHourlyDataPerSite,topDailyDataPerSite,totalVisitedPerDay,totalVisitedPerHour);

	  	// Create bar chart
		var barGraphView = new BarGraphView(container,model,totalVisitedPerDay,1);
		var barGraphView = new BarGraphView(container,model,totalVisitedPerHour,2);
		//var barGraphView = new BarGraphView(container,model,topHourlyDataPerSite[0],2);

	  	
	}

	function getFirstMonday()
	 {
	 	//check whether day 0 is a monday and set loop to start at first monday
	 	for(i=0; i<7;i++){	
	 		var firstMonday =0;
	 		var retrievedString = model.days[i][0].toString();
	 		var retrievedDay = (retrievedString.indexOf('Mon') > -1); //true
	 		if(retrievedDay == true){
	 			firstMonday = i;
	 			return firstMonday;
	 		}
	 	}
	}

	function getVisitedPerDay(firstMonday)
  	{
		var totalVisitedPerDay = [0,0,0,0,0,0,0];
	 	var dayNumber = 0;
	  	dayNumber = firstMonday;
	 	
	 	//for the last 12 weeks sum all visits of each weekday
	 	for (i=0; i<12; i++){	
	 		for(j=0; j<7; j++){	
	 			totalVisitedPerDay[j] += model.days[j+dayNumber][1].length
			}
			dayNumber+=7;
	 	}

	 	//make averages
	 	for (i=0; i<totalVisitedPerDay.length;i++){
	 		totalVisitedPerDay[i] = (totalVisitedPerDay[i]/12).toFixed(0);
	 	}
	 	return totalVisitedPerDay;
 	}

	function getTopDailyData(firstMonday,topData)
	{	
		var topDailyDataPerSite = [];
	  	for(i=0;i<10;i++)
	  	{	
	  		topDailyDataPerSite.push([0,0,0,0,0,0,0]);
	  		dayNumber = firstMonday;
	  		//alert(dayNumber);
		   	//for the last 12 weeks sum all visits of each weekday
		 	for (k=0; k<12; k++)
		 	{	
		 		for(l=0; l<7; l++)
		 		{	
		 			for(m=0;m<model.days[l+dayNumber][2].length;m++)
		 			{	
			 			if (model.days[l+dayNumber][2][m][0] == topData[i][0])
			 			{	
			 				topDailyDataPerSite[i][l] += model.days[l+dayNumber][2][m][1];
			 			}
			 		}
				}
				dayNumber +=7;
		 	}
		 	
		 	//make averages
		 	for (m=0; m<topDailyDataPerSite[i].length;m++){
		 		topDailyDataPerSite[i][m] = (topDailyDataPerSite[i][m]/12).toFixed(0);
		 	}
		 	
	  	}
	  	return topDailyDataPerSite;
	}

	function getVisitedPerHour()
	{
	  	var totalVisitedPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var hourNumber =0;
		
		for (i=0; i<90; i++){
	 		for(j=0; j<24; j++){	
	 			for(k=0; k<model.hours[(j+hourNumber)][2].length; k++){
	 				totalVisitedPerHour[j] += model.hours[(j+hourNumber)][2][k][1];
	 			} 							 
			}
			hourNumber +=24;
	 	}

	 	//make averages
	 	for (i=0;i<totalVisitedPerHour.length;i++){
	 		totalVisitedPerHour[i] = (totalVisitedPerHour[i]/90).toFixed(1);
	 	}
	 	return totalVisitedPerHour;
	}


	function getTopHourlyData(topData)
	{	
	 	var topHourlyDataPerSite =[];
	 
	 	for(i=0;i<10;i++)
	  	{	
	  		topHourlyDataPerSite.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
	  		var hourNumber2 =0;
		
			for (j=0; j<90; j++)
			{
		 		for(k=0; k<24; k++)
		 		{	
		 			for(l=0;l<model.hours[k+hourNumber2][2].length; l++)
		 			{	
			 			if (model.hours[k+hourNumber2][2][l][0] == topData[i][0])
			 			{	
			 				topHourlyDataPerSite[i][k] += model.hours[k+hourNumber2][2][l][1];
			 			}
		 			} 							 
				}
				hourNumber2 +=24;
		 	}
		 	
		 	//make averages
		 	for (m=0; m<topHourlyDataPerSite[i].length;m++){
		 		topHourlyDataPerSite[i][m] = (topHourlyDataPerSite[i][m]/90).toFixed(1);
		 	}
		 	
		}
		return topHourlyDataPerSite
	}


	this.daysButton = daysButton;
	this.hoursButton = hoursButton;	
	
	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'dataReady')
		{
			updateData();
		}
	}
 }