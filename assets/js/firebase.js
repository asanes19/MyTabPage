const firebaseConfig = {
  apiKey: "AIzaSyB4StbfPiQrwdq419Zjuj3ZTqMMQfQPAjc",
  authDomain: "myownhomepage-15bf01930.firebaseapp.com",
  databaseURL: "https://myownhomepage-15bf01930-default-rtdb.firebaseio.com",
  projectId: "myownhomepage-15bf01930",
  storageBucket: "myownhomepage-15bf01930.appspot.com",
  messagingSenderId: "1062804101168",
  appId: "1:1062804101168:web:7d4659d8aea216a2cfb5f5"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var myOwnHomePageDB = firebase.database().ref("myOwnHomePage");

document.getElementById("linkForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var linkName = getElementVal("linkName");
  var linkURL = getElementVal("linkURL");
  var linkType = getElementVal("linkType");

  saveMessages(linkName, linkURL, linkType);

  location.reload();
}

const saveMessages = (linkName, linkURL, linkType) => {
  var newmyOwnHomePage = myOwnHomePageDB.push();

  newmyOwnHomePage.set({
    linkName: linkName,
    linkURL: linkURL,
    linkType: linkType,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// ... Your existing code ...
myOwnHomePageDB.once("value").then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const linkData = childSnapshot.val();
    const linkType = linkData.linkType;
    const linkName = linkData.linkName;
    const linkURL = linkData.linkURL;
    const linkKey = childSnapshot.key; // Get the unique key for each link

    // Create a new row div element
    const row = document.createElement("div");
    row.className = "data-row";
    row.setAttribute("data-key", linkKey); // Set the linkKey as a data attribute

    // Create and populate icon element
    const iconElement = document.createElement("i");
    iconElement.className = "icon fa fa-link"; // Font Awesome icon
    row.appendChild(iconElement); // Append icon to the row

    // Create and populate link element
    const linkElement = document.createElement("a");
    linkElement.className = "link-element";
    linkElement.textContent = linkName;
    linkElement.href = linkURL;
    linkElement.target = "_blank"; // Open link in a new tab
    row.appendChild(linkElement);

    // Create a delete icon element
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "delete-icon fa fa-trash";
    deleteIcon.addEventListener("click", () => deleteLink(linkKey, linkType));
    row.appendChild(deleteIcon);

    // Get the appropriate data section based on linkType
    const dataSection = document.querySelector(`.${linkType} .data-section`);
    if (dataSection) {
      // Append the row to the data section
      dataSection.appendChild(row);
    }
  });
});

function deleteLink(linkKey, linkType) {
  // Remove from Firebase
  myOwnHomePageDB.child(linkKey).remove();

  // Remove from HTML
  const dataSection = document.querySelector(`.${linkType} .data-section`);
  const row = document.querySelector(`.${linkType} .data-row[data-key="${linkKey}"]`);
  if (dataSection && row) {
    dataSection.removeChild(row);
  }
}
