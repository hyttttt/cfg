window.onload = function () {
  // get hash list
  var list;
  fetch("/api/binary")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      list = response;
      console.log(response);
    })
    .catch((error) => console.error(error));
};

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
      // redirect to cfg page and bring data along
      //window.location.href = "binary/" + response.hash;
      console.log(response);
    })
    .catch((error) => console.error(error));
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
