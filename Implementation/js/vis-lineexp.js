// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 20;

// Drop down id
var selectedValue;

// Declare tool-tip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.EDITION + "<br/>" + d[selectedValue];
    });

// Declare svg
var svg = d3.select("#line-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// All data
var DATA;

// Initialise scales
var xScale = d3.time.scale()
    .range([0,width]);
var yScale = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// Label the x-axis
svg.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");

// Declare axes groups
var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height+ ")");
var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

// Define line function
var line = d3.svg.line()
    .x(function(d) { return xScale(d.YEAR); })
    .y(function(d) { return yScale(d[selectedValue]); })
    .interpolate("linear");

// Declare line group
var lineGroup = svg.append("g")
    .append("path")
    .attr("class", "line");

// Define a y-axis label
var axisLabel = svg.append("text")
    .attr("x", padding)
    .attr("y", padding - margin.top)
    .attr("text-anchor", "middle");

// Initialize data
loadData();

// Load CSV file
function loadData() {
    d3.json("data/CO2emissions2.json", function(error, json) {

        json.forEach(function(d){
            // Convert string to 'date object'
            d.year = formatDate.parse(d.year);

            // Convert numeric values to 'numbers'
            for (var i = 0; i < 248; i++){
                d.values[i].emission = +d.values[i].emission
            }
        });

        // Store json data in global variable
        DATA = json;

        var filteredData;
        // Filter data of the relevant country
        filteredData = DATA.forEach(function(d){
            d.values.filter(function (e){
                return (e.country == "Albania")
            });
        });
        console.log(filteredData);
    });
}

/*
// Render visualization
function updateVisualization() {

    var filteredData;
    // Filter data within the range
    filteredData = DATA.filter(function(d){
        for (var i = 0; i < 248; i++){
            return (d.values[i].country == "Albania");
        }
    });
    console.log(filteredData);

    // Call the tool-tip
    svg.call(tip);

    // Update the domain for the scales
    xScale.domain(d3.extent(filteredData,function(d){
        return d.YEAR;
    }));
    yScale.domain(d3.extent(filteredData,function(d){
        return d[selectedValue];
    }));

    // Append path to line group
    lineGroup.transition().duration(800)
        .attr("d", line(filteredData));

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
            return xScale(d.YEAR);
        })
        .attr("cy", function(d){
            return yScale(d[selectedValue]);
        });

    // Call on events
    circle
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", showEdition);

    // Call the relevant axes
    xAxisGroup.transition().duration(800).call(xAxis);
    yAxisGroup.transition().duration(800).call(yAxis);

    // Append a y-axis label
    axisLabel.text(function() {
        switch (selectedValue) {
            case "GOALS":
                return "Goals";
                break;
            case "AVERAGE_GOALS":
                return "Average goals";
                break;
            case "MATCHES":
                return "Matches";
                break;
            case "TEAMS":
                return "Teams";
                break;
            case "AVERAGE_ATTENDANCE":
                return "Average attendance";
                break;
        }
    });

    // Remove irrelevant selection
    circle.exit()
        .remove();
}
*/