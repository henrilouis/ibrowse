var BarGraphView = function(container,model,hourlyData,daylyData)
{ 
  var viewType =2;

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

  
  var toolTip = d3.select("#bargraph")
  .append("div")
  .attr("class", "ch-tooltip");

  updateData();
  d3.select("#viewButton").on("change", updateData);

  function updateData()
  { 
    if (viewType ==1){viewType = 2;}
    else {viewType = 1}
    d3.select("#bargraph svg").remove();
    data=[];

    var svg = d3.select("#bargraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    if (viewType ==1)
    {
      
      // Get the data again
      for(i=0;i<hourlyData.length;i++)
      {
          data[i]={hour:i, visits:parseFloat(hourlyData[i])};
          
      }

      x.domain(data.map(function(d) { return d.hour+":00"; }));
      y.domain([0, d3.max(data, function(d) { return d.visits; })]);
    }
    else if (viewType ==2)
    {
      // Get the data again
      data[0]={day:0, dname: "Monday",    visits:parseInt(daylyData[0])};
      data[1]={day:1, dname: "Tuesday",   visits:parseInt(daylyData[1])};
      data[2]={day:2, dname: "Wednesday", visits:parseInt(daylyData[2])};
      data[3]={day:3, dname: "Thursday",  visits:parseInt(daylyData[3])};
      data[4]={day:4, dname: "Friday",    visits:parseInt(daylyData[4])};
      data[5]={day:5, dname: "Saturday",  visits:parseInt(daylyData[5])};
      data[6]={day:6, dname: "Sunday",    visits:parseInt(daylyData[6])};
      x.domain(data.map(function(d) { return d.dname; }));
      y.domain([0, d3.max(data, function(d) { return d.visits; })]);
    }

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("x",-10)
      .attr("y", -5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Visits");

    if (viewType ==1)
    {
    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.hour+":00"); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.visits); })
      .attr("height", function(d) { return height - y(d.visits); })

      .on('mouseover', function(d){
        toolTip
        .html(d.visits+" visits at "+d.hour+"h")
        .attr("style", "display: block;");

        toolTip.attr("style",
              "display: block; " +
              "margin-left: " + (x(d.hour+":00")-(x.rangeBand()/2)-4) + "px; " +
              "margin-top: " + (y(d.visits)) + "px;");
      })
      .on('mouseout', function(d){
        toolTip
        .attr("style", "display:none")
        .html("");
      });
    }
    else if (viewType ==2)
    {
    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.dname); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.visits); })
      .attr("height", function(d) { return height - y(d.visits); })

      .on('mouseover', function(d){
        toolTip
        .html(d.visits+" visits on "+d.dname+"s")
        .attr("style", "display: block;");

        toolTip.attr("style",
              "display: block; " +
              "margin-left: " + (x(d.dname)+15) + "px; " +
              "margin-top: " + (y(d.visits)-20) + "px;");
      })
      .on('mouseout', function(d){
        toolTip
        .attr("style", "display:none")
        .html("");
      });
    }


    d3.select("#sortButton").on("change", change);

    var sortTimeout = setTimeout(function(){
      d3.select("input").property("checked", false).each(change);
    }, 0);

      function change()
      { 
        if (viewType ==1)
        {
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
        else if (viewType ==2)
        {
          clearTimeout(sortTimeout);
          // Copy-on-write since tweens are evaluated after a delay.
          var x0 = x.domain(data.sort(this.checked
              ? function(a, b) { return b.visits - a.visits; }
              : function(a, b) { return d3.ascending(a.day, b.day); })
              .map(function(d) { return d.dname; }))
              .copy();

          var transition = svg.transition().duration(750),
              delay = function(d, i) { return i * 50; };

          transition.selectAll(".bar")
              .delay(delay)
              .attr("x", function(d) { return x0(d.dname); });

          transition.select(".x.axis")
              .call(xAxis)
            .selectAll("g")
              .delay(delay);
        }
    }
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