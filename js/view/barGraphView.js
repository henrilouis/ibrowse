var BarGraphView = function(container,model,hourlyData)
{	

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 700,
		    height = 200;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10, "visits");
			
		var data = [];



		for(i=0;i<hourlyData.length;i++)
		{
			data[i]={hour:i+":00", frequency:hourlyData[i]};
		}

		var svg = d3.select("#bargraph").append("svg:svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		  x.domain(data.map(function(d) { return d.hour; }));
		  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Visits");

		  svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.hour); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.frequency); })
		      .attr("height", function(d) { return height - y(d.frequency); });





		function type(d) {
		  d.frequency = +d.frequency;
		  return d;
		}
	
	
	// Observer Pattern
	model.addObserver(this);

	this.update = function(args)
	{
		if(args == 'hoursReady')
		{
			//update();
		}
	}
}