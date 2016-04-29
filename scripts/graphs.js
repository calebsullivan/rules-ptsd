
 
var s1 = sigma.parsers.json( "/api/full",  {container: 'network-graph'},
function(s){
  nodeId = parseInt(getParameterByName('node_id'));
  var selectedNode;

  function splitter(n){
        var output = [],
        sNumber = n.toString();

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
        output.push(+sNumber.charAt(i));
    }
    return output;
  }

  s.graph.edges().forEach(function(edge, i, a) {
    edge.color = "#AAA";
  });

  s.graph.nodes().forEach(function(node, i, a) {
    if (node.id == nodeId) {
      selectedNode = node;
      return;
    }
  });

  //Initialize nodes as a circle
  var j = 0, k = 1;
  s.graph.nodes().forEach(function(node, i, a) {
    var split = splitter(node.id),
        col, row, intNode = parseInt(node.id);

    switch(split[1]){
      case '0':
        row = 0;
        break;
      case '2':
        row = 300;
        break;
      case '5':
        row = 500;
        break;
      case '8':
        row = 700;
        break;
      default:
        row = 0;
    }
    if(parseInt(split[2]) > k){
      j = 0;
      k = parseInt(split[2]);
    } else {
      j = j + 20;
    }

    node.y = row+(intNode%100)+i%10+j;
    node.x = parseInt(split[2])*200;
  });

  //Call refresh to render the new graph
  s.settings({
    font:"times",
    sideMargin:15,
    labelThreshold:0
  });
  s.camera.goTo({
    x: 140,
    y: 20,
    angle: 0,
    ratio: 1
  });
  s.refresh();
  console.log(s);
  s1 = s;

  // s.startForceAtlas2();

  s.bind('clickNode', function(e) {
      console.log(e);
  });

  if (selectedNode != undefined){
    s.cameras[0].goTo({x:selectedNode['read_cam0:x'],y:selectedNode['read_cam0:y'],ratio:0.1});
  }
});


console.log("SigmaJS loaded", s1);
console.log("graphs.js loaded");