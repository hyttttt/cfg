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
  var cfg_list;

  fetch(`/binary/${hash}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("/binary/:hash response");
      console.log(response);
      //cfg_list = response;
    })
    .catch((error) => console.error(error));

  loadList(cfg_list);

  refreshDot(cfg_list.function[0].cfg_id);

  drawColorPattern("colors", "colorMeaning");
};

// Intent: Refresh dot graph with the cfg_id
// Parameter: cfg_id (string)
// Return: None
function refreshDot(cfg_id) {
  // parsing raw dot file
  var raw = mockApi("GET", "/cfg", cfg_id);
  var mydot = parseDot(raw.dot);
  var digraph = mydot.digraph;
  var nodeList = mydot.nodeList;
  var edgeList = mydot.edgeList;

  // clear old assembly div
  for (i = 0; i < nodeList.length; i++) {
    const assDiv = document.getElementById(nodeList[i].node);
    if (assDiv) assDiv.remove();
  }

  // draw the graph according to dot file
  drawDot(digraph, nodeList, edgeList);
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

function mockApi(method, router, parameter) {
  // return a list of cfg_id and corresponding function name
  if (method == "GET" && router == "/binary" && parameter != "") {
    var funcs = [];

    var name = parameter.split("_")[0];

    funcs.push({
      cfg_id: name + "_cfg_id_0",
      name: name + "_whole",
    });

    for (i = 1; i < 31; i++) {
      funcs.push({
        cfg_id: name + "_cfg_id_" + i,
        name: name + "_function_" + i,
      });
    }

    return { hash: parameter, function: funcs };
  }
  // return cfg_id and dot
  else if (method == "GET" && router == "/cfg" && parameter != "") {
    var dot = "";

    if (parameter == "output_cfg_id_0") {
      dot =
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
    } else if (parameter == "simple1_cfg_id_0") {
      dot =
        'strict digraph  {\
        bb_80483ed [assembly="134513645: PUSH EBP\n134513646: MOV EBP,ESP\n134513648: CMP dword ptr [EBP + 0x8],0x0\n134513652: JLE 0x080483ff\n", function=f0];\
        bb_80483f6 [assembly="134513654: MOV dword ptr [EBP + 0x8],0x1\n134513661: JMP 0x08048406\n", function=f0];\
        bb_80483ff [assembly="134513663: MOV dword ptr [EBP + 0x8],0x2\n", function=f0];\
        bb_8048406 [assembly="134513670: POP EBP\n134513671: RET\n", function=f0];\
        bb_8048408 [assembly="134513672: PUSH EBP\n134513673: MOV EBP,ESP\n134513675: SUB ESP,0x14\n134513678: CMP dword ptr [EBP + -0x4],0x0\n134513682: JLE 0x08048421\n", function=main];\
        bb_8048414 [assembly="134513684: MOV EAX,dword ptr [EBP + -0x4]\n134513687: MOV dword ptr [ESP],EAX\n134513690: CALL 0x080483ed\n", function=main];\
        bb_804841f [assembly="134513695: JMP 0x0804842d\n", function=main];\
        bb_8048421 [assembly="134513697: MOV dword ptr [ESP],0x0\n134513704: CALL 0x080483ed\n", function=main];\
        bb_804842d [assembly="134513709: LEAVE\n134513710: RET\n", function=main];\
        bb_80483ed -> bb_80483ff  [flowType="Conditional Jump"];\
        bb_80483ed -> bb_80483f6  [flowType=Fall];\
        bb_80483f6 -> bb_8048406  [flowType=Jump];\
        bb_80483ff -> bb_8048406  [flowType=Fall];\
        bb_8048406 -> bb_804842d  [flowType=Return];\
        bb_8048406 -> bb_804841f  [flowType=Return];\
        bb_8048408 -> bb_8048421  [flowType="Conditional Jump"];\
        bb_8048408 -> bb_8048414  [flowType=Fall];\
        bb_8048414 -> bb_80483ed  [flowType=Call];\
        bb_8048414 -> bb_804841f  [flowType=Fall];\
        bb_804841f -> bb_804842d  [flowType=Jump];\
        bb_8048421 -> bb_80483ed  [flowType=Call];\
        bb_8048421 -> bb_804842d  [flowType=Fall];\
        }';
    } else if (parameter == "ais3_cfg_id_0") {
      dot =
        'strict digraph  {\
        bb_4003f0 [assembly="4195312: JMP qword ptr [0x00601000]\n", function=puts];\
        bb_400520 [assembly="4195616: PUSH RBP\n4195617: MOV RBP,RSP\n4195620: MOV qword ptr [RBP + -0x18],RDI\n4195624: MOV dword ptr [RBP + -0x4],0x0\n4195631: JMP 0x004005a1\n", function=verify];\
        bb_400531 [assembly="4195633: MOV EAX,dword ptr [RBP + -0x4]\n4195636: MOVSXD RDX,EAX\n4195639: MOV RAX,qword ptr [RBP + -0x18]\n4195643: ADD RAX,RDX\n4195646: MOVZX EAX,byte ptr [RAX]\n4195649: MOV EDX,EAX\n4195651: MOV EAX,dword ptr [RBP + -0x4]\n4195654: XOR EAX,EDX\n4195656: MOV byte ptr [RBP + -0x5],AL\n4195659: MOVZX EDX,byte ptr [RBP + -0x5]\n4195663: MOV EAX,dword ptr [RBP + -0x4]\n4195666: XOR EAX,0x9\n4195669: AND EAX,0x3\n4195672: MOV ECX,EAX\n4195674: SHL EDX,CL\n4195676: MOV EAX,EDX\n4195678: MOV EDX,EAX\n4195680: MOVZX ESI,byte ptr [RBP + -0x5]\n4195684: MOV EAX,dword ptr [RBP + -0x4]\n4195687: XOR EAX,0x9\n4195690: AND EAX,0x3\n4195693: MOV ECX,EAX\n4195695: MOV EAX,0x8\n4195700: SUB EAX,ECX\n4195702: MOV ECX,EAX\n4195704: SAR ESI,CL\n4195706: MOV EAX,ESI\n4195708: OR EAX,EDX\n4195710: MOV byte ptr [RBP + -0x5],AL\n4195713: ADD byte ptr [RBP + -0x5],0x8\n4195717: MOV EAX,dword ptr [RBP + -0x4]\n4195720: CDQE\n4195722: MOVZX EAX,byte ptr [RAX + 0x601020]\n4195729: CMP AL,byte ptr [RBP + -0x5]\n4195732: JZ 0x0040059d\n", function=verify];\
        bb_400596 [assembly="4195734: MOV EAX,0x0\n4195739: JMP 0x004005c3\n", function=verify];\
        bb_40059d [assembly="4195741: ADD dword ptr [RBP + -0x4],0x1\n", function=verify];\
        bb_4005a1 [assembly="4195745: MOV EAX,dword ptr [RBP + -0x4]\n4195748: MOVSXD RDX,EAX\n4195751: MOV RAX,qword ptr [RBP + -0x18]\n4195755: ADD RAX,RDX\n4195758: MOVZX EAX,byte ptr [RAX]\n4195761: TEST AL,AL\n4195763: JNZ 0x00400531\n", function=verify];\
        bb_4005b9 [assembly="4195769: CMP dword ptr [RBP + -0x4],0x17\n4195773: SETZ AL\n4195776: MOVZX EAX,AL\n", function=verify];\
        bb_4005c3 [assembly="4195779: POP RBP\n4195780: RET\n", function=verify];\
        bb_4005c5 [assembly="4195781: PUSH RBP\n4195782: MOV RBP,RSP\n4195785: SUB RSP,0x10\n4195789: MOV dword ptr [RBP + -0x4],EDI\n4195792: MOV qword ptr [RBP + -0x10],RSI\n4195796: CMP dword ptr [RBP + -0x4],0x2\n4195800: JZ 0x004005eb\n", function=main];\
        bb_4005da [assembly="4195802: MOV EDI,0x4006c8\n4195807: CALL 0x004003f0\n", function=main];\
        bb_4005e4 [assembly="4195812: MOV EAX,0xffffffff\n4195817: JMP 0x0040061d\n", function=main];\
        bb_4005eb [assembly="4195819: MOV RAX,qword ptr [RBP + -0x10]\n4195823: ADD RAX,0x8\n4195827: MOV RAX,qword ptr [RAX]\n4195830: MOV RDI,RAX\n4195833: CALL 0x00400520\n", function=main];\
        bb_4005fe [assembly="4195838: TEST EAX,EAX\n4195840: JZ 0x0040060e\n", function=main];\
        bb_400602 [assembly="4195842: MOV EDI,0x4006f0\n4195847: CALL 0x004003f0\n", function=main];\
        bb_40060c [assembly="4195852: JMP 0x00400618\n", function=main];\
        bb_40060e [assembly="4195854: MOV EDI,0x400718\n4195859: CALL 0x004003f0\n", function=main];\
        bb_400618 [assembly="4195864: MOV EAX,0x0\n", function=main];\
        bb_40061d [assembly="4195869: LEAVE\n4195870: RET\n", function=main];\
        bb_4003f0 -> bb_40060c  [flowType=Return];\
        bb_4003f0 -> bb_400618  [flowType=Return];\
        bb_4003f0 -> bb_4005e4  [flowType=Return];\
        bb_400520 -> bb_4005a1  [flowType=Jump];\
        bb_400531 -> bb_40059d  [flowType="Conditional Jump"];\
        bb_400531 -> bb_400596  [flowType=Fall];\
        bb_400596 -> bb_4005c3  [flowType=Jump];\
        bb_40059d -> bb_4005a1  [flowType=Fall];\
        bb_4005a1 -> bb_400531  [flowType="Conditional Jump"];\
        bb_4005a1 -> bb_4005b9  [flowType=Fall];\
        bb_4005b9 -> bb_4005c3  [flowType=Fall];\
        bb_4005c3 -> bb_4005fe  [flowType=Return];\
        bb_4005c5 -> bb_4005eb  [flowType="Conditional Jump"];\
        bb_4005c5 -> bb_4005da  [flowType=Fall];\
        bb_4005da -> bb_4003f0  [flowType=Call];\
        bb_4005da -> bb_4005e4  [flowType=Fall];\
        bb_4005e4 -> bb_40061d  [flowType=Jump];\
        bb_4005eb -> bb_400520  [flowType=Call];\
        bb_4005eb -> bb_4005fe  [flowType=Fall];\
        bb_4005fe -> bb_40060e  [flowType="Conditional Jump"];\
        bb_4005fe -> bb_400602  [flowType=Fall];\
        bb_400602 -> bb_4003f0  [flowType=Call];\
        bb_400602 -> bb_40060c  [flowType=Fall];\
        bb_40060c -> bb_400618  [flowType=Jump];\
        bb_40060e -> bb_4003f0  [flowType=Call];\
        bb_40060e -> bb_400618  [flowType=Fall];\
        bb_400618 -> bb_40061d  [flowType=Fall];\
        }';
    }

    return { cfg_id: parameter, dot: dot };
  }
}

// Intent: load the entry points we have and make it a list
// Parameter: A cfg id json, containing {hash: hash of the binary, function: an array of {cfg_id: cfg unique id of function, name: name of function}}
// Return: None
function loadList(data) {
  var myList = document.getElementById("myList");

  for (i = 0; i < data.function.length; i++) {
    const newLi = document.createElement("a");
    newLi.innerHTML = data.function[i].name;
    newLi.className = "list-group-item";

    (function (id) {
      newLi.onclick = function () {
        refreshDot(id);
      };
    })(data.function[i].cfg_id);

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
