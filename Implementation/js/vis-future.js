
// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 20;

// Declare tool-tip
var tipFuture = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

// Declare svg
var svgFuture = d3.select("#future-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Data in a global variable
var data;

// Initialise scales
var x = d3.time.scale()
    .range([0,width]);

var y = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxs = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxs = d3.svg.axis()
    .scale(y)
    .orient("left");

// Label the axes: x-axis
svgFuture.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");
// y-axis
svgFuture.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("class", "y-axis-label")
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("CO2 emissions");

// Declare axes groups
var xAxsGroup = svgFuture.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height+ ")");
var yAxsGroup = svgFuture.append("g")
    .attr("class", "y-axis axis");

// Define line function
var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.emissions); })
    .interpolate("linear");

// Declare line group
var lineGroupFuture = svgFuture.append("g")
    .append("path")
    .attr("class", "line");

// Define a y-axis label
var axisLabel = svgFuture.append("text")
    .attr("x", padding)
    .attr("y", padding - margin.top)
    .attr("text-anchor", "middle");

// Initialize data
loadData();

// Load CSV file
function loadData() {
    d3.csv("data/emissions_co2_80pct_RE_ITI.csv", function(error, csv) {

        if (error) throw error;

        csv.forEach(function(d){
            // Convert string to 'date object'
            d.year = formatDate.parse(d.year);

            // Convert numeric values to 'numbers'
            d.emissions = +d.emissions;
        });

        // Store csv data in global variable
        data = csv;

        // Draw the visualization for the first time
        updateVisualization(data);
    });
}

// Render visualization
function updateVisualization(data) {

    // Update tooltip text
    tipFuture.html(function(d){
        return "Year: " + d.year.getFullYear() + "</br>CO2 emissions: " +
            "" + d.emissions.toFixed(2) + " million metric tonnes";
    });

    // Call the tool-tip
    svgFuture.call(tipFuture);

    // Update the domain for the scales
    x.domain(d3.extent(data,function(d){
        return d.year;
    }));
    y.domain([0,
        d3.max(data,function(d){
        return d.emissions;
    })]);

    // Append path to line group
    lineGroupFuture.transition().duration(800)
        .attr("d", line(data));

    // Data-bind
    var circle = svgFuture.selectAll("circle")
        .data(data);

    // Enter/Append circles
    circle.enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", 4);

    // Update
    circle
        .transition().duration(800)
        .attr("cx", function(d){
            return x(d.year);
        })
        .attr("cy", function(d){
            return y(d.emissions);
        });

    // Call on events
    circle
        .on("mouseover", tipFuture.show)
        .on("mouseout", tipFuture.hide);

    // Call the relevant axes
    xAxsGroup.transition().duration(800).call(xAxs);
    yAxsGroup.transition().duration(800).call(yAxs);

    // Remove irrelevant selection
    circle.exit()
        .remove();
}