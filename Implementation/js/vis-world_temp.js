
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
        return d.Year + "<br/>" + d.Annual_Mean;
    });

// Declare svg
var svg = d3.select("#line-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// FIFA world cup
var data;

// Initialise scales
var xScale = d3.time.scale()
    .range([0,width]);
var yScale_Annual = d3.scale.linear()
    .range([height, 0]);
var yScale_Five_year = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxis_Annual = d3.svg.axis()
    .scale(yScale_Annual)
    .orient("left");
var yAxis_Five_year = d3.svg.axis()
    .scale(yScale_Annual)
    .orient("right");

// Label the x-axis
svg.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");

// Declare axes groups
var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height+ ")");
var yAxisGroup_Annual = svg.append("g")
    .attr("class", "y-axis axis");
var yAxisGroup_Five_year = svg.append("g")
    .attr("class", "y-axis axis")
    .attr("transform", "translate(" + width + " ,0)");

// Define line functions
var line_Annual = d3.svg.line()
    .x(function(d) { return xScale(d.Year); })
    .y(function(d) { return yScale_Annual(d.Annual_Mean); })
    .interpolate("linear");
var line_Five_Year = d3.svg.line()
    .x(function(d) { return xScale(d.Year); })
    .y(function(d) { return yScale_Five_year(d.Five_Year_Mean); })
    .interpolate("linear");

// Declare line groups
var lineGroup_Annual = svg.append("g")
    .append("path")
    .attr("class", "line-annual");
var lineGroup_Five_Year = svg.append("g")
    .append("path")
    .attr("class", "line-years");

// Define a y-axis label
var axisLabel = svg.append("text")
    .attr("x", padding)
    .attr("y", padding - margin.top)
    .attr("text-anchor", "middle");

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
            d.Five_Year_Mean = +d.Five_Year_Mean;
        });

        // Store csv data in global variable
        data = csv;
        console.log(data);

        // Draw the visualization for the first time
        updateVisualization();
    });
}

// Render visualization
function updateVisualization() {

    /*// Get the value selected by the user
    selectedValue = d3.select("#data-type").property("value");

    // Years selected
    var min_year = formatDate.parse(d3.select("#min-year").property("value").toString());
    var max_year = formatDate.parse(d3.select("#max-year").property("value").toString());

    var filteredData;
    /!* Filter data within the range
     * I recognise that a better transition for this would be the zoom
     * transition but I could not do it *!/
    if (min_year != null && max_year != null){
        filteredData = data.filter(function(d){
            return (min_year <= d.YEAR && d.YEAR <= max_year);
        })
    }
    else filteredData = data;*/

    // Call the tool-tip
    //svg.call(tip);

    // Filtering out the values of 0 for filtered data since those result
    // from empty slots in our data
    var filteredData = data.filter(function(d){
        return (d.Five_Year_Mean != 0);
    });

    // Update the domain for the scales
    xScale.domain(d3.extent(data,function(d){
        return d.Year;
    }));
    yScale_Annual.domain(d3.extent(data,function(d){
        return d.Annual_Mean;
    }));
    yScale_Five_year.domain(d3.extent(data,function(d){
        return d.Five_Year_Mean;
    }));

    // Append path to line groups
    lineGroup_Annual.transition().duration(800)
        .attr("d", line_Annual(data));
    lineGroup_Five_Year.transition().duration(800)
        .attr("d", line_Five_Year(filteredData));

    /*// Data-bind
    var circle = svg.selectAll("circle")
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
            return xScale(d.Year);
        })
        .attr("cy", function(d){
            return yScale(d.Annual_Mean);
        });

    // Call on events
    circle
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);*/

    // Call the relevant axes
    xAxisGroup.transition().duration(800).call(xAxis);
    yAxisGroup_Five_year.transition().duration(800)
        .style("fill", "red")
        .call(yAxis_Five_year);
    yAxisGroup_Annual.transition().duration(800).call(yAxis_Annual);

    // Append a y-axis label
    /*axisLabel.text(function() {
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
    });*/

    // Remove irrelevant selection
    /*circle.exit()
        .remove();*/
}