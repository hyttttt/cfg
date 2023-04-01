window.onload = function () {
  // load the binaries we have and make it a list
  loadList();

  var raw =
    'strict digraph  {\
      bb_400520 [assembly="4195616: PUSH RBP\n4195617: MOV RBP,RSP\n4195620: MOV qword ptr [RBP + -0x18],RDI\n4195624: MOV dword ptr [RBP + -0x4],0x0\n4195631: JMP 0x004005a1\n"];\
      bb_400531 [assembly="4195633: MOV EAX,dword ptr [RBP + -0x4]\n4195636: MOVSXD RDX,EAX\n4195639: MOV RAX,qword ptr [RBP + -0x18]\n4195643: ADD RAX,RDX\n4195646: MOVZX EAX,byte ptr [RAX]\n4195649: MOV EDX,EAX\n4195651: MOV EAX,dword ptr [RBP + -0x4]\n4195654: XOR EAX,EDX\n4195656: MOV byte ptr [RBP + -0x5],AL\n4195659: MOVZX EDX,byte ptr [RBP + -0x5]\n4195663: MOV EAX,dword ptr [RBP + -0x4]\n4195666: XOR EAX,0x9\n4195669: AND EAX,0x3\n4195672: MOV ECX,EAX\n4195674: SHL EDX,CL\n4195676: MOV EAX,EDX\n4195678: MOV EDX,EAX\n4195680: MOVZX ESI,byte ptr [RBP + -0x5]\n4195684: MOV EAX,dword ptr [RBP + -0x4]\n4195687: XOR EAX,0x9\n4195690: AND EAX,0x3\n4195693: MOV ECX,EAX\n4195695: MOV EAX,0x8\n4195700: SUB EAX,ECX\n4195702: MOV ECX,EAX\n4195704: SAR ESI,CL\n4195706: MOV EAX,ESI\n4195708: OR EAX,EDX\n4195710: MOV byte ptr [RBP + -0x5],AL\n4195713: ADD byte ptr [RBP + -0x5],0x8\n4195717: MOV EAX,dword ptr [RBP + -0x4]\n4195720: CDQE\n4195722: MOVZX EAX,byte ptr [RAX + 0x601020]\n4195729: CMP AL,byte ptr [RBP + -0x5]\n4195732: JZ 0x0040059d\n"];\
      bb_400596 [assembly="4195734: MOV EAX,0x0\n4195739: JMP 0x004005c3\n"];\
      bb_40059d [assembly="4195741: ADD dword ptr [RBP + -0x4],0x1\n"];\
      bb_4005a1 [assembly="4195745: MOV EAX,dword ptr [RBP + -0x4]\n4195748: MOVSXD RDX,EAX\n4195751: MOV RAX,qword ptr [RBP + -0x18]\n4195755: ADD RAX,RDX\n4195758: MOVZX EAX,byte ptr [RAX]\n4195761: TEST AL,AL\n4195763: JNZ 0x00400531\n"];\
      bb_4005b9 [assembly="4195769: CMP dword ptr [RBP + -0x4],0x17\n4195773: SETZ AL\n4195776: MOVZX EAX,AL\n"];\
      bb_4005c3 [assembly="4195779: POP RBP\n4195780: RET\n"];\
      bb_4005c5 [assembly="4195781: PUSH RBP\n4195782: MOV RBP,RSP\n4195785: SUB RSP,0x10\n4195789: MOV dword ptr [RBP + -0x4],EDI\n4195792: MOV qword ptr [RBP + -0x10],RSI\n4195796: CMP dword ptr [RBP + -0x4],0x2\n4195800: JZ 0x004005eb\n"];\
      bb_4005da [assembly="4195802: MOV EDI,0x4006c8\n4195807: CALL 0x004003f0\n"];\
      bb_4005e4 [assembly="4195812: MOV EAX,0xffffffff\n4195817: JMP 0x0040061d\n"];\
      bb_4005eb [assembly="4195819: MOV RAX,qword ptr [RBP + -0x10]\n4195823: ADD RAX,0x8\n4195827: MOV RAX,qword ptr [RAX]\n4195830: MOV RDI,RAX\n4195833: CALL 0x00400520\n"];\
      bb_4005fe [assembly="4195838: TEST EAX,EAX\n4195840: JZ 0x0040060e\n"];\
      bb_400602 [assembly="4195842: MOV EDI,0x4006f0\n4195847: CALL 0x004003f0\n"];\
      bb_40060c [assembly="4195852: JMP 0x00400618\n"];\
      bb_40060e [assembly="4195854: MOV EDI,0x400718\n4195859: CALL 0x004003f0\n"];\
      bb_400618 [assembly="4195864: MOV EAX,0x0\n"];\
      bb_40061d [assembly="4195869: LEAVE\n4195870: RET\n"];\
      bb_400520 -> bb_4005a1  [flowType=Jump];\
      bb_400531 -> bb_40059d  [flowType="Conditional Jump"];\
      bb_400531 -> bb_400596  [flowType=Jump];\
      bb_400596 -> bb_4005c3  [flowType=Jump];\
      bb_40059d -> bb_4005a1  [flowType=Jump];\
      bb_4005a1 -> bb_400531  [flowType="Conditional Jump"];\
      bb_4005a1 -> bb_4005b9  [flowType=Jump];\
      bb_4005b9 -> bb_4005c3  [flowType=Jump];\
      bb_4005c5 -> bb_4005eb  [flowType="Conditional Jump"];\
      bb_4005c5 -> bb_4005da  [flowType=Jump];\
      bb_4005da -> bb_4005e4  [flowType=Jump];\
      bb_4005e4 -> bb_40061d  [flowType=Jump];\
      bb_4005eb -> bb_400520  [flowType=Call];\
      bb_4005eb -> bb_4005fe  [flowType=Jump];\
      bb_4005fe -> bb_40060e  [flowType="Conditional Jump"];\
      bb_4005fe -> bb_400602  [flowType=Jump];\
      bb_400602 -> bb_40060c  [flowType=Jump];\
      bb_40060c -> bb_400618  [flowType=Jump];\
      bb_40060e -> bb_400618  [flowType=Jump];\
      bb_400618 -> bb_40061d  [flowType=Jump];\
      }';

  // parsing raw dot file
  var mydot = parseDot(raw);
  var digraph = mydot.digraph;
  var nodeList = mydot.nodeList;
  var edgeList = mydot.edgeList;

  // draw the graph according to dot file
  drawDot(digraph, nodeList, edgeList);
};

// load the binaries we have and make it a list
function loadList() {
  var myList = document.getElementById("myList");

  for (i = 0; i < 30; i++) {
    const newLi = document.createElement("a");
    newLi.innerHTML = "New List Item " + i;
    newLi.className = "list-group-item";
    newLi.href = "cfg.html";

    newLi.onmouseover = function () {
      this.className = "list-group-item active";
    };

    newLi.onmouseout = function () {
      this.className = "list-group-item";
    };

    myList.appendChild(newLi);
  }
}

// Intent: parsing raw dot file
// Parameter: A raw dot file (string)
// Return: A parsed dot file json, containing {clean dot, node list, edge list}
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
      var temp3 = temp1[1].split("\n");
      for (j = 0; j < temp3.length; j++) {
        if (temp3[j] != "") assembly += temp3[j] + "<br>";
      }

      var node = temp2[temp2.length - 2];

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
      edgeList.push({ node1: nodes[0], node2: nodes[1], flowType: flowType });
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
    /*g.setEdge(e.v, e.w, {
      label: flow.label,
      style: `stroke: ${flow.color}; stroke-width: 1.5px; fill: #fff;`,
      arrowheadStyle: `stroke: ${flow.color}; fill: ${flow.color};`,
    });*/
    g.setEdge(e.v, e.w, {
      style: `stroke: ${flow.color}; stroke-width: 1.5px; fill: #fff;`,
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

  var edges = document.querySelectorAll(".edgePath");

  // Show node's name when mouse hover
  var nodes = document.querySelectorAll(".node");

  // adjust radius of node
  const rects = document.querySelectorAll("rect");
  rects.forEach(function (rect) {
    rect.setAttribute("rx", 10);
    rect.setAttribute("ry", 10);
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
    var mouseX = 0;
    var mouseY = 0;
    document.addEventListener("mousemove", function (event) {
      mouseX = event.clientX + window.pageXOffset;
      mouseY = event.clientY + window.pageYOffset;
    });

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
  var colorMap = {
    '"Conditional Jump"': "#FFB04B",
    Jump: "#E05E66",
    Call: "#3FFA63",
    ret: "#AB74F7",
    Fall: "#5EB6E0",
  };

  for (i = 0; i < edgeList.length; i++) {
    if (edgeList[i].node1 == node1 && edgeList[i].node2 == node2)
      return {
        label: edgeList[i].flowType,
        color: colorMap[edgeList[i].flowType],
      };
  }
  /*
  edgeList.forEach(function (edge) {
    if (edge.node1 == node1 && edge.node2 == node2) {
      console.log(`${node1}, ${node2}, ${edge.flowType}`);

      var result = {
        label: edge.flowType,
        style: `stroke: ${colorMap[edge.flowType]};\
        stroke-width: 1.5px;\
        fill: ${colorMap[edge.flowType]}`,
      };

      return colorMap[edge.flowType];
    }
  });*/
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

// Intent: remove the subwindow to hide information when not hovering the node
// Parameter: None
// Return: None
function hide_info(id) {
  if (document.getElementById(id)) {
    document.getElementById(id).remove();
  }
}
