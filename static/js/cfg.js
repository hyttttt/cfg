window.onload = function () {
  //testAPI();

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

      digraph += edge + ";";
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

  // Render the graphlib object using d3
  var render = new dagreD3.render();
  render(d3.select("svg"), g);

  // resize the SVG element based on the contents
  var svg = document.querySelector("#graphContainer");
  var bbox = svg.getBBox();
  svg.style.width = bbox.width + 40.0 + "px";
  svg.style.height = bbox.height + 40.0 + "px";

  // Show node's name when mouse hover
  var nodes = document.querySelectorAll(".node");
  for (i = 0; i < nodes.length; i++) {
    nodes[i].onmouseover = function () {
      var str = getAssembly(this.textContent, nodeList);
      show_info(str);
    };
    nodes[i].onmouseout = hide_info;
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

// Intent: create a window that show the node's assembly when hover the node
// Parameter: assembly code (string)
// Return: None
function show_info(information) {
  // get mouse position
  // refer to: https://tw511.com/a/01/2703.html
  var parent = document.querySelector(".draw");
  var mouseX = 0;
  var mouseY = 0;
  var event = event || window.event;

  if (event.pageX || event.pageY) {
    mouseX = event.pageX;
    mouseY = event.pageY;
  } else if (event.clientX || event.clientY) {
    mouseX =
      event.clientX +
      document.documentElement.scrollLeft +
      document.body.scrollLeft;
    mouseY =
      event.clientY +
      document.documentElement.scrollTop +
      document.body.scrollTop;
  }

  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight;

  // create new window
  createADWindow(parent, "new", centerX, centerY, mouseX, mouseY, information);
}

// Intent: create a new sub window at assigned place and show the assembly code
// Parameter: parent div,
//            assigned id of new window,
//            window's center position x,
//            window's center position y,
//            mouse's center position x,
//            mouse's center position y,
//            assembly code of the node
// Return: None
// refer to: https://mrcodingroom.freesite.host/js%E6%87%B8%E6%B5%AE%E5%BC%8F%E7%AA%97%E3%80%81%E6%8B%96%E5%8B%95%E8%A6%96%E7%AA%97%E3%80%81%E5%BB%A3%E5%91%8A%E8%A6%96%E7%AA%97/
const createADWindow = (
  app,
  id,
  p_centerX,
  p_centerY,
  mouseX,
  mouseY,
  information
) => {
  // set up sub window
  if (document.getElementById(id)) return;
  const mainDiv = document.createElement("div");
  mainDiv.id = id;

  // node's information
  mainDiv.innerHTML = information;

  // add new window
  app.appendChild(mainDiv);

  // sub window's position
  var rect = mainDiv.getBoundingClientRect();
  var posX = mouseX - rect.width / 2;
  var posY = 0;
  if (mouseY > p_centerY) {
    posY = mouseY - rect.height - 30;
  } else {
    posY = mouseY + 30;
  }

  mainDiv.style.cssText += `top:${posY}px;` + `left: ${posX}px;`;
};

// Intent: remove the subwindow to hide information when not hovering the node
// Parameter: None
// Return: None
function hide_info() {
  if (document.getElementById("new")) {
    document.getElementById("new").remove();
  }
}
