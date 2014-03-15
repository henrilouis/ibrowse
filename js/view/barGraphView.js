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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Visits:</strong> <span style='color:brown'>" + d.visits + "</span>";
  })

var svg = d3.select("#bargraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var data = [];
    for(i=0;i<hourlyData.length;i++)
    {
        data[i]={hour:i, visits:hourlyData[i]};
    }

  x.domain(data.map(function(d) { return d.hour+":00"; }));
  y.domain([0, d3.max(data, function(d) { return d.visits; })]);

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
      .attr("x", function(d) { return x(d.hour+":00"); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.visits); })
      .attr("height", function(d) { return height - y(d.visits); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

d3.select("#dayButton").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", false).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.visits - a.visits; }
        : function(a, b) { return d3.ascending(a.hour, b.hour); })
        .map(function(d) { return d.hour+":00"; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.hour+":00"); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
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