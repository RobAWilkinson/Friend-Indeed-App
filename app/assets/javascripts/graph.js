d3.json("http://localhost:3000/api/users", function(root){
  
  var links =[];

  connections(root);

  function connections(people){
    var arr = people;
    var arrleng = arr.length;


    
    for (var i = 0; i < arrleng; i++) {
      // console.log(arr[i]);
      for(var j = 0; arr[i].deeds.length; i++) {
        // console.log(arr[i].deeds[j]);
        links.push({source: arr[i], target: arr[i], type: 'resolved'});
      }
      // console.log(arr[i].deeds[0].from_id);

      
    };
  };

  
  var nodes = {};
    // Compute the distinct nodes from the links.
  links.forEach(function(link) {
    // console.log(link.target.deeds[0]['to_id'])
    link.source = nodes[link.source.uid] || (nodes[link.source.uid] = {name: link.source.name});
    link.target = nodes[link.target.deeds[0]['to_id']] || (nodes[link.target.deeds[0]['to_id']] = {name: link.target.name});
  });

  var width = 1300,
      height = 500;

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(100)
      .charge(-300)
      .on("tick", tick)
      .start();

  var svg = d3.select("body").append("svg")
      .attr("width", width + "px")
      .attr("height", height + "px");

  // Per-type markers, as they don't inherit styles.
  svg.append("defs").selectAll("marker")
      .data(["suit", "licensing", "resolved"])
    .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5");

  var path = svg.append("g").selectAll("path")
      .data(force.links())
    .enter().append("path")
      .attr("class", function(d) { return "link " + d.type; })
      .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

  var circle = svg.append("g").selectAll("circle")
      .data(force.nodes())
    .enter().append("circle")
      .attr("r", "15px")
      .call(force.drag);

  var text = svg.append("g").selectAll("text")
      .data(force.nodes())
    .enter().append("text")
      .attr("x", 8)
      .attr("y", ".31em")
      .text(function(d) { return d.name; });

  // Use elliptical arc path segments to doubly-encode directionality.
  function tick() {
    path.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);
  }

  function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  }

  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }
});