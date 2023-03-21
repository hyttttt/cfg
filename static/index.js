// create a new sub window at assigned place
// this window show some information about the point
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

// create a window that show the node's assembly when hover the node
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

// hide information when not hovering the node
function hide_info() {
  if (document.getElementById("new")) {
    document.getElementById("new").remove();
  }
}

// test if the API works
function testAPI() {
  //const url = "http://example.com/api/data";
  const url = "";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

// load the binaries we have and make it a list
function loadList() {
  var myList = document.getElementById("myList");

  for (i = 0; i < 30; i++) {
    const newLi = document.createElement("li");
    newLi.innerHTML = "New List Item " + i;
    newLi.className = "list-group-item";

    newLi.onmouseover = function () {
      this.className = "list-group-item active";
    };

    newLi.onmouseout = function () {
      this.className = "list-group-item";
    };

    myList.appendChild(newLi);
  }
}

// draw the graph according to dot file
function drawDot(mydot) {
  // Parse the DOT syntax into a graphlib object
  var g = graphlibDot.read(mydot);

  // Render the graphlib object using d3
  var render = new dagreD3.render();
  render(d3.select("svg g"), g);

  // resize the SVG element based on the contents
  var svg = document.querySelector("#graphContainer");
  var bbox = svg.getBBox();
  svg.style.width = bbox.width + 40.0 + "px";
  svg.style.height = bbox.height + 40.0 + "px";

  // Show node's name when mouse hover
  var nodes = document.querySelectorAll(".node");
  for (i = 0; i < nodes.length; i++) {
    nodes[i].onmouseover = function () {
      var str = "";
      for (j = 0; j < 10; j++) {
        str += this.textContent + "'s Assembly code<br>";
      }
      show_info(str);
    };
    nodes[i].onmouseout = hide_info;
  }
}

// Read dot file
// refer to: https://stackoverflow.com/questions/22595493/reading-dot-files-in-javascript-d3
window.onload = function () {
  //testAPI();

  // load the binaries we have and make it a list
  loadList();

  // draw the graph according to dot file
  var mydot =
    "strict digraph  {" +
    "bb_400520 -> bb_4005a1;" +
    "bb_400531 -> bb_40059d;" +
    "bb_400531 -> bb_400596;" +
    "bb_400596 -> bb_4005c3;" +
    "bb_40059d -> bb_4005a1;" +
    "bb_4005a1 -> bb_400531;" +
    "bb_4005a1 -> bb_4005b9;" +
    "bb_4005b9 -> bb_4005c3;" +
    "bb_4005c5 -> bb_4005eb;" +
    "bb_4005c5 -> bb_4005da;" +
    "bb_4005da -> bb_4005e4;" +
    "bb_4005e4 -> bb_40061d;" +
    "bb_4005eb -> bb_400520;" +
    "bb_4005eb -> bb_4005fe;" +
    "bb_4005fe -> bb_40060e;" +
    "bb_4005fe -> bb_400602;" +
    "bb_400602 -> bb_40060c;" +
    "bb_40060c -> bb_400618;" +
    "bb_40060e -> bb_400618;" +
    "bb_400618 -> bb_40061d;" +
    "}";
  drawDot(mydot);
};
