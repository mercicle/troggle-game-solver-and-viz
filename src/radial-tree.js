
/* thanks to https://codepen.io/fernoftheandes/pen/pcoFz for example */

import d3 from 'd3'
//import root from './example-tree-data'

var root = {};
function plotTree(in_tree){

  console.log('inside plotTree')
   
  //root =   Object.assign({ }, in_tree);
  root = JSON.parse(JSON.stringify(in_tree));
  console.log(root)
  var diameter = 800;

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = diameter,
      height = diameter;
      
  const edge_length_factor = 40;

  var i = 0,
      duration = 350;

  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 80])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 10) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  d3.select("#tree_svg").remove()

  var svg = d3.select("#radialTree")
                .append("svg")
                  .attr("id", "tree_svg")
                  .attr("width", width )
                  .attr("height", height )
                  .append("g")
                    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
 
  root.x0 = height / 2;
  root.y0 = 0;

  update(root);

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * edge_length_factor; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", 10)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text(function(d) { return d.label; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1)
        .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + ( 60 )  + ")"; }); //d.label.length +

    // TODO: appropriate transform
    var nodeExit = node.exit().transition()
        .duration(duration)
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
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

  // Collapse nodes
  function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
  }

}
 
export default plotTree;