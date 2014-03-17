var PiechartView = function(container,model,topData)
{
	var w = 550;
	var h = 420;
	var r = 200;
	var ir = 130;
	var textOffset = 25;
	var tweenDuration = 250;

	//OBJECTS TO BE POPULATED WITH DATA LATER
	var lines, valueLabels, nameLabels, favIcons;
	var pieData = [];    
	var oldPieData = [];
	var filteredPieData = [];

	//D3 helper function to populate pie slice parameters from array data
	var donut = d3.layout.pie().value(function(d){
	  return d[1];
	});

	//D3 helper function to create colors from an ordinal scale
	var color = d3.scale.category20();

	//D3 helper function to draw arcs, populates parameter "d" in path object
	var arc = d3.svg.arc()
	  .startAngle(function(d){ return d.startAngle; })
	  .endAngle(function(d){ return d.endAngle; })
	  .innerRadius(ir)
	  .outerRadius(r);

	///////////////////////////////////////////////////////////
	// CREATE VIS & GROUPS ////////////////////////////////////
	///////////////////////////////////////////////////////////

	var vis = d3.select("#piechart").append("svg:svg")
	  .attr("width", w)
	  .attr("height", h);

	//GROUP FOR ARCS/PATHS
	var arc_group = vis.append("svg:g")
	  .attr("class", "arc")
	  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

	//GROUP FOR LABELS
	var label_group = vis.append("svg:g")
	  .attr("class", "label_group")
	  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

	//GROUP FOR CENTER TEXT  
	var center_group = vis.append("svg:g")
	  .attr("class", "center_group")
	  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

	//PLACEHOLDER GRAY CIRCLE
	var paths = arc_group.append("svg:circle")
	    .attr("fill", "#EFEFEF")
	    .attr("r", r);

	///////////////////////////////////////////////////////////
	// CENTER TEXT ////////////////////////////////////////////
	///////////////////////////////////////////////////////////

	//WHITE CIRCLE BEHIND LABELS
	var whiteCircle = center_group.append("svg:circle")
	  .attr("fill", "white")
	  .attr("r", ir);

	// "TOTAL" LABEL
	var totalLabel = center_group.append("svg:text")
	  .attr("class", "label")
	  .attr("dy", -45)
	  .attr("text-anchor", "middle") // text-align: right
	  .attr("fill", "#333333")
	  .text("TOTAL");

	//TOTAL TRAFFIC VALUE
	var totalValue = center_group.append("svg:text")
	  .attr("class", "total")
	  .attr("dy", 20)
	  .attr("text-anchor", "middle") // text-align: right
	  .attr("fill", "#333333")
	  .text("Select day");

	//UNITS LABEL
	var totalUnits = center_group.append("svg:text")
	  .attr("class", "units")
	  .attr("dy", 55)
	  .attr("text-anchor", "middle") // text-align: right
	  .attr("fill", "#333333")
	  .text("Sites");


	///////////////////////////////////////////////////////////
	// STREAKER CONNECTION ////////////////////////////////////
	///////////////////////////////////////////////////////////
	update();
	var totalSites = 0;
	// to run each time data is generated
	function update() 
	{
	  streakerDataAdded = topData;

	  oldPieData = filteredPieData;
	  pieData = donut(streakerDataAdded);

	  
	  filteredPieData = pieData.filter(filterData);
	  function filterData(element, index, array) {
	    element.name = streakerDataAdded[index][0];
	    element.value = streakerDataAdded[index][1];
	    totalSites += element.value;
	    return (element.value > 0);
	  }

	  if(filteredPieData.length > 0 && oldPieData.length > 0){

	    //REMOVE PLACEHOLDER CIRCLE
	    arc_group.selectAll("circle").remove();

	    totalValue.text(function(){
	      return totalSites;
	    });

	    //DRAW ARC PATHS
	    paths = arc_group.selectAll("path").data(filteredPieData);
	    paths.enter().append("svg:path")
	      .attr("stroke", "white")
	      .attr("stroke-width", 2)
	      .attr("fill", function(d, i) { return color(i); })
	      .on("mouseover",update_legend)
	  	  .on("mouseout",remove_legend)
	      .transition()
	        .duration(tweenDuration)
	        .attrTween("d", pieTween);
	  }  

	}

	///////////////////////////////////////////////////////////
	// FUNCTIONS //////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	function update_legend(d)
    {
		// "TOTAL" LABEL
	 	totalLabel.text(d.name);
		//TOTAL TRAFFIC VALUE
		totalValue.text((d.value/totalSites*100).toFixed(1) + "%");
		//UNITS LABEL
		totalUnits.text("OF VISITS");
		d3.select(this)
	      	.attr("stroke-width", 0);

    }

    function remove_legend(d)
    {
    	
    ///////////////////////////////////////////////////////////
	// CENTER TEXT ////////////////////////////////////////////
	///////////////////////////////////////////////////////////

	// "TOTAL" LABEL
	  totalLabel.text("TOTAL");

	//TOTAL TRAFFIC VALUE
	  totalValue.text(totalSites);

	//UNITS LABEL
	  totalUnits.text("VISITS");

	  d3.select(this)
	      	.attr("stroke-width", 2);
    }


	// Interpolate the arcs in data space.
	function pieTween(d, i) {
	  var s0;
	  var e0;
	  if(oldPieData[i]){
	    s0 = oldPieData[i].startAngle;
	    e0 = oldPieData[i].endAngle;
	  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
	    s0 = oldPieData[i-1].endAngle;
	    e0 = oldPieData[i-1].endAngle;
	  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
	    s0 = oldPieData[oldPieData.length-1].endAngle;
	    e0 = oldPieData[oldPieData.length-1].endAngle;
	  } else {
	    s0 = 0;
	    e0 = 0;
	  }
	  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
	  return function(t) {
	    var b = i(t);
	    return arc(b);
	  };
	}

	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'dataReady')
		{
			update();
		}
	}
}