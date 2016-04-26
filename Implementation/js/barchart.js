/**
 * Created by snowby98 on 4/23/16.
 */


var BarChart = function(_parentElement, _data) {

    var vis =this;
    vis.parentElement = _parentElement;
    vis.data = _data;
    //creating parameters
    vis.margin = {top: 30, right: 20, bottom: 30, left: 40},
        vis.width = 860 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;
        vis.padding = 10;
//initialize scales

     vis.x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1);


     vis.y = d3.scale.linear()
        .range([vis.height, 0]);

//set axis
    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");



    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left")
        .ticks(10);


    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //console.log(vis.data);
    vis.UpdateVis();
};

BarChart.prototype.wrangleData = function(d) {
    var vis = this;
    vis.data = d;
    //console.log(d,vis.data);
    vis.UpdateVis();
};

BarChart.prototype.UpdateVis = function() {
    var vis = this;
    //console.log(vis.data);


    this.x.domain(vis.data.map(function (d) {
        return d.Code
    }));
    this.y.domain([0, d3.max(vis.data, function (d) {
        return d[2011]
    })]);

    vis.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(7," + vis.height + ")")
        .call(vis.xAxis);


    vis.svg.append("g")
        .attr("class", "y axis")

        .call(vis.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("C02 Emissions");




    var rect= vis.svg.selectAll(".bar")
        .data(vis.data);
    rect.enter()

        .append("rect")
        .style("fill", "steelblue")
        .attr("class", "bar");


        rect.transition()
        .duration(900)
        .attr("x", function (d) {
        return vis.x(d.Code);
        })
        .attr("width", vis.x.rangeBand())
        .attr("y", function (d) {
            return vis.height - vis.y(d[2011]);
        })
        .attr("height", function (d) {
            return vis.y(d[2011]);
        });

    rect.exit().remove();





};
//derived from Mike Bostock's https://bl.ocks.org/mbostock/3943967 Tutorial

//function changevisualization(){