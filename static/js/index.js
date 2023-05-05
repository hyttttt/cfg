window.onload = function () {};

function mockApi(method, router, parameter) {
  // upload binary then return hash
  if (method == "POST" && router == "/binary") {
    return { hash: "output_hash" }; // temperarily return a dot file name
  }
  // return hash list (all the binaries in the database)
  else if (method == "GET" && router == "/binary" && parameter == "") {
    return { hash_list: ["output_hash", "simple1_hash", "ais3_crackme_hash"] };
  }
}

function uploadFile() {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];

  var formData = new FormData();
  formData.append("file", file);

  fetch("/api/binary", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      goCFG(response.hash);
    })
    .catch((error) => console.error(error));
}

function goCFG(hash) {
  fetch(`/binary/${hash}`).catch((error) => console.error(error));
}

// load the binaries we have and make it a list
function loadList(list) {
  var myList = document.getElementById("myList");

  for (i = 0; i < list.hash_list.length; i++) {
    const newLi = document.createElement("a");
    newLi.innerHTML = list.hash_list[i];
    newLi.className = "list-group-item";
    newLi.href = "binary/" + list.hash_list[i];

    newLi.onmouseover = function () {
      this.className = "list-group-item active";
    };

    newLi.onmouseout = function () {
      this.className = "list-group-item";
    };

    myList.appendChild(newLi);
  }
}
