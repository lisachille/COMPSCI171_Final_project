// inspiration from http://bl.ocks.org/d3noob/8375092

var margin = {top: 50, right: 500, bottom: 50, left: 200},
    width = 1000 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var i = 0,
    root,
    duration = 800;

var tree = d3.layout.tree()
    .size([height, width]);

// orient links
var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree-area").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data, function for updating root
d3.json("data/malaria-parasites.json", function(error, data) {
    // make root, set original x0 and y0
    root = data[0];
    root.x0 = 0;
    root.y0 = 0;

    update(root);
});


function update(rootinput) {

    // Assign nodes and links.
    var nodes = tree.nodes(root),
        links = tree.links(nodes);


    // Declare the nodes
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Append node to particular position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + rootinput.y0 + "," + rootinput.x0 + ")"; })
        .on("click", click);

    // Add Circles
    nodeEnter.append("circle")
        .style("fill", function(d){
            return d._children ? "lightsteelblue" : "white";
        })
        .attr("r", 10);

    // Add text
    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -16 : 15; })
        .attr("dy", ".35em")  /* centers text */
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start"; }) /* anchors text */
        .text(function(d) { return d.name; });

    // Change nodes, circle, text.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    nodeUpdate.select("circle")
        .style("fill", function(d) { return d._children ? "#85144b" : "#fff"; })
        .attr("r", 10);
    nodeUpdate.select("text");

    // Exit nodes, circles, text.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + rootinput.y + "," + rootinput.x + ")"; })
        .remove();
    nodeExit.select("circle");
    nodeExit.select("text");


    // Declare link variable¦
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Add links WOOHOO!
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: rootinput.x0, y: rootinput.y0};
            return diagonal({source: o, target: o});
        });

    // Move links when clicked.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Remove old links.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: rootinput.x, y: rootinput.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Remember old nodes for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// on click...
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}