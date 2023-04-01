window.onload = function () {
  // load the binaries we have and make it a list
  loadList();
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
