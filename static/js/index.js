window.onload = function () {
  // load the binaries we have and make it a list
  //var hash_list = mockApi("GET", "/binary", "");
  var hash_list = fetch("api/binary")
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = function () {
        const text = reader.result;
        const data = JSON.parse(text);
        console.log("blob");
        console.log(data);
        hash_list = data;
      };
      reader.readAsText(blob);
    })
    .catch((error) => console.error(error));

  console.log("hash list");
  console.log(hash_list);
  loadList(hash_list);

  const fileInput = document.querySelector("#fileInput");
  fileInput.addEventListener("change", (event) => {
    uploadFile(event.target.files[0]);
  });
};

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

function uploadFile(file) {
  console.log("Upload file name: " + file.name);

  const form = new FormData();
  form.append("file", file);

  // get hash to find the cfg_ids & function names
  //var hash = mockApi("POST", "/binary", "");

  var hash;
  fetch("api/binary", {
    method: "POST",
    body: form,
  })
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = function () {
        const text = reader.result;
        const data = JSON.parse(text);

        hash = data;
        console.log(data);
      };
      reader.readAsText(blob);
    })
    .catch((error) => console.error(error));

  console.log("hash");
  console.log(hash);

  // redirect to cfg page and bring data along
  //window.location.href = "binary/" + hash["hash"];
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
