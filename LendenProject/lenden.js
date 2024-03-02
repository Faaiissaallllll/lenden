
// THIS FUNCTION VALDATE THE INPUT
function validateForm() {
  var street = document.getElementById("street").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip-code").value;

  if (street === "") {
    showToast("Street Address is required", "error");
    return false;
  }

  if (city === "") {
    showToast("City is required", "error");
    return false;
  }

  if (state === "") {
    showToast("State is required", "error");
    return false;
  }

  if (zip === "") {
    showToast("Zip-code is required", "error");
    return false;
  }

  if (zip < 0) {
    showToast("Zip-code can never be negative", "error");
    return false;
  }

  return true;
}

// THIS FUNCTION SHOW THE DATA
function showData() {
  var peopleList = localStorage.getItem("peopleList") ? JSON.parse(localStorage.getItem("peopleList")) : [];
  var html = "";

  peopleList.forEach(function (element, index) {
    html += "<tr>";
    html += "<td>" + (index + 1) + "</td>";
    html += "<td>" + element.streetAddress + ", " + element.city + ", " + element.state + ", " + element.zip_code + "</td>";
    html += '<td><button onclick="deleteData(' + index + ')" class="btn btn-danger">Delete</button><button onclick="updateData(' + index + ')" class="btn btn-warning m-2">Edit</button></td>';
    html += "</tr>";
  });

  document.querySelector("#crudTable tbody").innerHTML = html;
}

window.onload = showData();

// THIS FUNCTION ADD THE NEW ADDRESS
function AddData() {
  var street = document.getElementById("street").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip-code").value;

  var isDuplicate = checkDuplicateAddress(street, city, state, zip);

  if (isDuplicate) {
    showToast("The address already exists", "error");
    return;
  }

  if (validateForm()) {
    var peopleList = localStorage.getItem("peopleList") ? JSON.parse(localStorage.getItem("peopleList")) : [];

    peopleList.push({
      streetAddress: street,
      city: city,
      state: state,
      zip_code: zip,
    });

    localStorage.setItem("peopleList", JSON.stringify(peopleList));
    showData();

    showToast("Address added successfully", "add");

    document.getElementById("street").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("zip-code").value = "";
  }
}

// THIS FUNCTION DELETE THE ADDRESS
function deleteData(index) {
  var peopleList = localStorage.getItem("peopleList") ? JSON.parse(localStorage.getItem("peopleList")) : [];
  peopleList.splice(index, 1);
  localStorage.setItem("peopleList", JSON.stringify(peopleList));
  showData();
  showToast("Address deleted successfully", "delete");
}

// THIS METHOD UPDATE THE DATA
function updateData(index) {
  document.getElementById("Add_Address").style.display = "none";
  document.getElementById("Update_Address").style.display = "block";

  var peopleList = localStorage.getItem("peopleList") ? JSON.parse(localStorage.getItem("peopleList")) : [];

  document.getElementById("street").value = peopleList[index].streetAddress;
  document.getElementById("city").value = peopleList[index].city;
  document.getElementById("state").value = peopleList[index].state;
  document.getElementById("zip-code").value = peopleList[index].zip_code;

  document.querySelector("#Update_Address").onclick = function () {
    if (validateForm()) {
      peopleList[index].streetAddress = document.getElementById("street").value;
      peopleList[index].city = document.getElementById("city").value;
      peopleList[index].state = document.getElementById("state").value;
      peopleList[index].zip_code = document.getElementById("zip-code").value;

      localStorage.setItem("peopleList", JSON.stringify(peopleList));
      showData();

      showToast("Address updated successfully", "update");

      document.getElementById("street").value = "";
      document.getElementById("city").value = "";
      document.getElementById("state").value = "";
      document.getElementById("zip-code").value = "";

      document.getElementById("Add_Address").style.display = "block";
      document.getElementById("Update_Address").style.display = "none";
    }
  };
}

// THIS FUNCTION CHECK FOR DUPLICATES
function checkDuplicateAddress(street, city, state, zip) {
  var peopleList = localStorage.getItem("peopleList") ? JSON.parse(localStorage.getItem("peopleList")) : [];
  for (var i = 0; i < peopleList.length; i++) {
    if (
      peopleList[i].streetAddress === street &&
      peopleList[i].city === city &&
      peopleList[i].state === state &&
      peopleList[i].zip_code === zip
    ) {
      return true;
    }
  }
  return false;
}

// THIS FUNCTION DISPLAY THE TOAST MESSAGE
function showToast(message, type) {
  var toast = document.getElementById("toast");
  var toastBody = toast.querySelector(".toast-body");

  var icons = {
    "add": "fas fa-plus-circle",
    "update": "fas fa-pencil-alt",
    "delete": "fa fa-trash"
  };

  var iconClass = icons[type] || "fas fa-info-circle";
  var iconElement = document.createElement("i");
  iconElement.className = iconClass;
  toastBody.appendChild(iconElement);

  var messageText = document.createTextNode(" " + message);
  toastBody.appendChild(messageText);

  if (type === "add") {
    toast.style.backgroundColor = "#28a745";
  } else if (type === "update") {
    toast.style.backgroundColor = "#fd7e14";
  } else if (type === "delete") {
    toast.style.backgroundColor = "red";
  }

  toast.style.display = "block";

  setTimeout(function () {
    toast.style.display = "none";
    toastBody.innerHTML = "";
  }, 1000);
}
