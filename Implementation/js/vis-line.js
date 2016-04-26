// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 20;

// Declare tool-tip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

// Declare svg
var svg = d3.select("#line-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialise scales
var xScaleline = d3.time.scale()
    .range([0,width]);
var yScale = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxisline = d3.svg.axis()
    .scale(xScaleline)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// Label the axes: x-axis
svg.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");
// y-axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("class", "y-axis-label")
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("CO2 emissions");

// Declare axes groups
var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")");
var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

// Declare line group
var lineGroup = svg.append("g")
    .append("path")
    .attr("class", "line");

d3.json("data/CO2emissions2.json", function(error, DATA) {

    // Error checking: Making sure the file loaded correctly
    if (error) throw error;

    DATA.forEach(function(d){
        // Convert string to 'date object'
        d.year = formatDate.parse(d.year);

        // Convert numeric values to 'numbers'
        for (var i = 0; i < 248; i++){
            d.values[i].emission = +d.values[i].emission
        }
    });

    var filteredData = [];

    // Filter data of the relevant country
    DATA.forEach(function(d){
        filteredData.push({year: d.year, emission: d.values[4].emission})
    });

    // Filter out the data that is not available
    filteredData = filteredData.filter(function(d){
        return (d.emission != 0);
    });

// Update the domain for the scales
    xScaleline.domain(d3.extent(filteredData,function(d){
        return d.year;
    }));
    yScale.domain(d3.extent(filteredData,function(d){
        return d.emission;
    }));

    // Define line function
    var line = d3.svg.line()
        .x(function(d) { return xScaleline(d.year); })
        .y(function(d) { return yScale(d.emission); })
        .interpolate("linear");

    // Append path to line group
    lineGroup.transition().duration(800)
        .attr("d", line(filteredData))
    ;

    tip.html(function(d){
        return "Year: " + d.year.getFullYear() + "</br>CO2 emissions: " + d.emission.toFixed(2) + "t/capita";
    });

    // Call the tool-tip
    svg.call(tip);

    // Data-bind
    var circle = svg.selectAll("circle")
        .data(filteredData);

    // Enter/Append circles
    circle.enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", 4);

    // Update
    circle
        .transition().duration(800)
        .attr("cx", function(d){
            return xScaleline(d.year);
        })
        .attr("cy", function(d){
            return yScale(d.emission);
        });

    // Call on events
    circle
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    // Call the relevant axes
    xAxisGroup.transition().duration(800).call(xAxisline);
    yAxisGroup.transition().duration(800).call(yAxis);

    // Remove irrelevant selection
    circle.exit()
        .remove();
});