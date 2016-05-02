// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 20;

// Declare svg
var svgtemp = d3.select("#line-areatemp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add title
svgtemp.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "100")
    .text("GLOBAL LAND-OCEAN TEMPERATURE INDEX");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Data
var worldData;

// Initialise scales
var xScaleTemp = d3.time.scale()
    .range([0,width]);
var yScaleTemp = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxisTemp = d3.svg.axis()
    .scale(xScaleTemp)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxisTemp = d3.svg.axis()
    .scale(yScaleTemp)
    .orient("left");


// Label the x-axis
svgtemp.append("text")
    .attr("class", "axis-label")
    .attr("transform","translate(" + (width - padding) / 2 + "," + (height + margin.bottom - padding) + ")")
    .text("Year");

// Declare axes groups
var xAxisGroupTemp = svgtemp.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")");
var yAxisGroupTemp = svgtemp.append("g")
    .attr("class", "y-axis axis axis-annual");


// Define the line function
var lineTemp = d3.svg.line()
    .x(function(d) { return xScaleTemp(d.Year); })
    .y(function(d) { return yScaleTemp(d.Annual_Mean); })
    .interpolate("linear");

// Declare line groups
var lineGroupTemp = svgtemp.append("g")
    .append("path")
    .attr("class", "line-annual");

// Define a y-axis label
var axisLabelTemp = svgtemp.append("text")
    .attr("x", padding - 220)
    .attr("y", padding - margin.top - 20)
    .attr("class", "axis-label")
    .attr("transform", "rotate(270)");

// Initialize data
loadData();

// Load CSV file
function loadData() {
    d3.csv("data/Global_temp.csv", function(error, csv) {

        // Error checking: Making sure the file loaded correctly
        if (error) throw error;

        csv.forEach(function(d){
            // Convert string to 'date object'
            d.Year = formatDate.parse(d.Year);

            // Convert numeric values to 'numbers'
            d.Annual_Mean = +d.Annual_Mean;
        });

        // Store csv data in global variable
        worldData = csv;

        // Draw the visualization for the first time
        updateVisualization(worldData);
    });
}

// Render visualization
function updateVisualization(dataTemp){

    // Filtering out the values of 0 for filtered data since those result
    // from empty slots in our data
    var filteredDataTemp = dataTemp.filter(function(d){
        return (data.Annual_mean != 0);
    });

    // Update the domain for the scales
    xScaleTemp.domain(d3.extent(dataTemp,function(d){
        return d.Year;
    }));
    yScaleTemp.domain(d3.extent(dataTemp,function(d){
        return d.Annual_Mean;
    }));

    // Append path to line groups
    lineGroup_Annual.transition().duration(800)
        .attr("d", lineTemp(filteredDataTemp));

    // Call the relevant axes
    xAxisGroupTemp.transition().duration(800).call(xAxisTemp);
    yAxisGroupTemp.transition().duration(800).call(yAxisTemp);

    // Append a y-axis label
    axisLabelTemp.html(function() {
        return "Annual Temperature Change (&deg C)";
    });

}