// edge color scheme
var colorMap = {
  "Conditional Jump": "#E05E66",
  Jump: "#FFB04B",
  Call: "#65B773",
  Fall: "#5EB6E0",
  Return: "#AB74F7",
};

window.onload = function () {
  var path = window.location.pathname.split("/");
  var hash = path[path.length - 1];

  // load the function list
  fetch(`/api/binary/${hash}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loadList(response);
      refreshDot(response[0].cfg_id);
    })
    .catch((error) => console.error(error));

  drawColorPattern("colors", "colorMeaning");
};

// Intent: Refresh dot graph with the cfg_id
// Parameter: cfg_id (string)
// Return: None
function refreshDot(cfg_id) {
  fetch(`/api/cfg/${cfg_id}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      var mydot = parseDot(response.dot);
      var digraph = mydot.digraph;
      var nodeList = mydot.nodeList;
      var edgeList = mydot.edgeList;

      console.log("raw dot:");
      console.log(response.dot);
      console.log("clean dot:");
      console.log(mydot);

      // clear old assembly div
      for (i = 0; i < nodeList.length; i++) {
        const assDiv = document.getElementById(nodeList[i].node);
        if (assDiv) assDiv.remove();
      }

      // draw the graph according to dot file
      drawDot(digraph, nodeList, edgeList);
    })
    .catch((error) => console.error(error));
}

// Intent: Draw the color pattern
// Parameter: color div's id (string), color meaning div's id (string)
// Return: None
function drawColorPattern(parentId_color, parentId_meaning) {
  var size = 15;

  // get parent containers
  var colorContainer = document.getElementById(parentId_color);
  var meaningContainer = document.getElementById(parentId_meaning);

  for (const [key, value] of Object.entries(colorMap)) {
    // color patterns
    var rect = document.createElement("div");
    rect.style.width = size + "px";
    rect.style.height = size + "px";
    rect.style.backgroundColor = value;
    rect.style.margin = "11px";

    colorContainer.appendChild(rect);

    // meanings
    rect = document.createElement("div");
    rect.style.width = "auto";
    rect.style.height = size + "px";
    rect.innerHTML = key;
    rect.style.margin = "10px 0px";

    meaningContainer.append(rect);
  }
}

// Intent: load the entry points we have and make it a list
// Parameter: A cfg id json, containing {hash: hash of the binary, function: an array of {cfg_id: cfg unique id of function, name: name of function}}
// Return: None
function loadList(data) {
  var myList = document.getElementById("myList");

  for (i = 0; i < data.length; i++) {
    const newLi = document.createElement("a");
    newLi.innerHTML = data[i].function;
    newLi.className = "list-group-item";

    (function (id) {
      newLi.onclick = function () {
        refreshDot(id);
      };
    })(data[i].cfg_id);

    newLi.onmouseover = function () {
      this.className = "list-group-item active";
      this.style.cssText += "cursor: pointer;";
    };

    newLi.onmouseout = function () {
      this.className = "list-group-item";
      this.style.cssText += "cursor: default;";
    };

    myList.appendChild(newLi);
  }
}

// Intent: parsing raw dot file
// Parameter: A raw dot file (string)
// Return: A parsed dot file json, containing {digraph: clean dot string, nodeList: array of nodes, edgeList: array of edges}
function parseDot(raw) {
  var digraph = "digraph  {";
  var nodeList = [];
  var edgeList = [];

  // collect all nodes' and edges' information
  var lines = raw.split(";");
  for (i = 0; i < lines.length; i++) {
    // node information
    if (lines[i].indexOf("assembly") != -1) {
      var temp1 = lines[i].split('"');
      var temp2 = temp1[0].split(" ");

      // turn dot's break line notation (\n) into html format (<br>)
      var assembly = "";
      var temp3 = temp1[1].split("\\n");
      for (j = 0; j < temp3.length; j++) {
        if (temp3[j] != "") assembly += temp3[j] + "<br>";
      }

      var node = temp2[temp2.length - 2];
      node = node.replace("\n", "");
      node = node.replace("{", "");

      nodeList.push({ node: node, assembly: assembly });
    }

    //edge information
    else if (lines[i].indexOf("flowType") != -1) {
      var temp1 = lines[i].split("  [");

      // get edge
      var edge = "";
      var flag = false;
      for (j = 0; j < temp1[0].length; j++) {
        if (temp1[0].charAt(j) != " ") flag = true;
        if (flag) edge += temp1[0].charAt(j);
      }

      var nodes = edge.split(" -> ");

      //get flowtype
      var temp2 = temp1[1].split("=");
      var flowType = temp2[1].slice(0, -1);

      digraph += edge + `[label=${flowType}];`;
      edgeList.push({
        node1: nodes[0].replace("\n", ""),
        node2: nodes[1],
        flowType: flowType,
      });
    }
  }

  digraph += "}";

  // wrap all result togather
  var result = { digraph: digraph, nodeList: nodeList, edgeList: edgeList };

  return result;
}

// Intent: draw the graph according to dot file
// Parameter: clean dot (string), node list (array), edge list (array)
// Return: None
function drawDot(digraph, nodeList, edgeList) {
  // Parse the DOT syntax into a graphlib object
  var g = graphlibDot.read(digraph);

  // change edge color according to flowtype
  g.edges().forEach(function (e) {
    var flow = getFlowtype(e.v, e.w, edgeList);
    g.setEdge(e.v, e.w, {
      //label: flow.label,
      style: `stroke: ${flow.color}; stroke-width: 2px; fill:none;`,
      arrowheadStyle: `stroke: ${flow.color}; fill: ${flow.color};`,
    });
  });

  // Render the graphlib object using d3
  var render = new dagreD3.render();
  render(d3.select("#graphContainer"), g);

  // resize the SVG element based on the contents
  var svg = document.querySelector("#graphContainer");
  var bbox = svg.getBBox();
  svg.style.width = bbox.width + 40.0 + "px";
  svg.style.height = bbox.height + 40.0 + "px";

  // Show node's name when mouse hover
  var nodes = document.querySelectorAll(".node");

  // adjust radius of node
  const rects = document.querySelectorAll("rect");
  rects.forEach(function (rect) {
    rect.setAttribute("rx", 10);
    rect.setAttribute("ry", 10);
  });

  // get mouse position
  var mouseX = 0;
  var mouseY = 0;
  document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX + window.pageXOffset;
    mouseY = event.clientY + window.pageYOffset;
  });

  nodes.forEach(function (node) {
    // create subwindow and hide it
    var nodeRect = node.getBoundingClientRect();
    var nodeName = node.textContent;
    var assembly = getAssembly(nodeName, nodeList);

    var parent = document.querySelector(".draw");
    var left = nodeRect.left;
    var top = nodeRect.top + nodeRect.height;

    var sub = createADWindow(parent, nodeName, top, left, assembly);

    // change visibility according to mouse's position
    var subRect = sub.getBoundingClientRect();

    node.onmouseover = function () {
      sub.style.visibility = "visible";
    };

    node.onmouseleave = function () {
      if (
        (mouseX < subRect.left ||
          mouseX > subRect.right ||
          mouseY < subRect.top - 20 ||
          mouseY > subRect.bottom) &&
        sub.style.visibility == "visible"
      ) {
        sub.style.visibility = "hidden";
      }
    };

    sub.onmouseleave = function () {
      sub.style.visibility = "hidden";
    };
  });
}

// Intent: Find the flowtype for the edge
// Parameter: node name 1 (string), node name 2 (string), edge List (array)
// Return: A json containing edge style
function getFlowtype(node1, node2, edgeList) {
  for (i = 0; i < edgeList.length; i++) {
    if (edgeList[i].node1 == node1 && edgeList[i].node2 == node2)
      return {
        label: edgeList[i].flowType,
        color: colorMap[edgeList[i].flowType.replaceAll('"', "")],
      };
  }
}

// Intent: Find the corresponding assembly for the node
// Parameter: node name (string), node list (array)
// Return: assembly code of the node
function getAssembly(node, nodeList) {
  for (i = 0; i < nodeList.length; i++) {
    if (nodeList[i].node == node) return nodeList[i].assembly;
  }
}

// Intent: create a new sub window at assigned place and show the assembly code
// Parameter: parent div,
//            assigned id of new window,
//            top position,
//            left position,
//            assembly code of the node
// Return: None
const createADWindow = (parent, id, top, left, information) => {
  // set up sub window
  if (document.getElementById(id)) return;
  const mainDiv = document.createElement("div");
  mainDiv.id = id;

  // node's information
  mainDiv.innerHTML = information;

  // add new window
  parent.appendChild(mainDiv);

  // sub window's style sheet
  mainDiv.style.cssText += `top:${top}px;\
  left: ${left}px;\
  position: absolute;\
  font-size: 15px;\
  font-family: 'Noto Sans';\
  text-align: left;\
  width: auto;\
  height: auto;\
  padding: 10px;\
  margin: 10px 0px;\
  background-color: #573596;\
  color: white;\
  border-radius: 10px;\
  visibility:hidden`;

  return mainDiv;
};
