window.onload = function () {
  // get hash list
  fetch("/api/binary")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("hash list:");
      console.log(response);
      loadList(response);
    })
    .catch((error) => console.error(error));
};

function uploadFile() {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];

  var formData = new FormData();
  formData.append("file", file);

  loadingPage();

  fetch("/api/binary", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      analyzingDone(response.hash);
      console.log("upload hash:");
      console.log(response);
    })
    .catch((error) => console.error(error));
}

function loadingPage() {
  var oldDiv = document.getElementById("contentArea");

  // create new div
  var newDiv = document.createElement("div");
  newDiv.className = "spinner-border text-purple mySpinner";
  newDiv.role = "status";

  // find parent div
  var parent = oldDiv.parentNode;
  parent.replaceChild(newDiv, oldDiv);
}

function analyzingDone(hash) {
  // check if analysis done every 10 sec
  setInterval(function () {
    fetch(`/api/binary/${hash}`)
      .then((response) => response.json())
      .then((response) => {
        if (response != null) window.location.href = "binary/" + hash;
      })
      .catch((error) => console.error(error));
  }, 10000);
}

// load the binaries we have and make it a list
function loadList(list) {
  var myList = document.getElementById("myList");

  for (i = 0; i < list.length; i++) {
    const newLi = document.createElement("a");
    newLi.innerHTML = list[i];
    newLi.className = "list-group-item";
    newLi.href = "binary/" + list[i];

    newLi.onmouseover = function () {
      this.className = "list-group-item active";
    };

    newLi.onmouseout = function () {
      this.className = "list-group-item";
    };

    myList.appendChild(newLi);
  }
}
