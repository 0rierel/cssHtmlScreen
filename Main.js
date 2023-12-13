const fixStringLength = array => {
  array.forEach(element => {
    if (element.name.length > 15) {
      element.name = element.name.substring(0, 12) + "...";
    }
    if (element.phoneNumber.length > 15) {
      element.phoneNumber = element.phoneNumber.substring(0, 12) + "...";
    }
    if (element.residance.length > 18) {
      element.residance = element.residance.substring(0, 15) + "...";
    }
    if (element.specificDetails.hobie.length > 13) {
      element.specificDetails.hobie = element.specificDetails.hobie.substring(0, 10) + "...";
    }
    if (element.specificDetails.book.length > 13) {
      element.specificDetails.book = element.specificDetails.book.substring(0, 10) + "...";
    }
  });
};
const getyoungsters = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5500/cssHtmlScreen/youngsters.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data.json");
    }
    const data = await response.json();
    fixStringLength(data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};
const updateTime = () => {
  const clock = document.getElementById("clock");
  clock.textContent = new Date().toLocaleTimeString();
};
let runningId;
const keepTimeUpdated = () => {
  if (runningId != undefined) {
    clearInterval(runningId);
    event.target.textContent = "הפעל";
    runningId = undefined;
  } else {
    updateTime();
    runningId = setInterval(updateTime, 1000);
    event.target.textContent = "עצור";
  }
};
const keepPressed = optionsButtons => {
  if (event.target.classList.contains("pressed")) {
    event.target.classList.remove("pressed");
  } else {
    for (let i = 0; i < optionsButtons.length; i++) {
      optionsButtons[i].classList.remove("pressed");
    }
    event.target.classList.add("pressed");
  }
};
const createRow = (youngster, table) => {
  let tr = Object.assign(document.createElement("tr"), {
    className: "bodyRow",
  });
  let tdNumber = Object.assign(document.createElement("td"), {
    className: `bodyCell number`,
    textContent: youngster.number,
  });
  tr.appendChild(tdNumber);
  let tdName = Object.assign(document.createElement("td"), {
    className: `bodyCell name`,
    textContent: youngster.name,
  });
  tr.appendChild(tdName);
  let tdResidance = Object.assign(document.createElement("td"), {
    className: `bodyCell residance`,
    textContent: youngster.residance,
  });
  tr.appendChild(tdResidance);
  let tdPhone = Object.assign(document.createElement("td"), {
    className: `bodyCell phoneNumber`,
    textContent: youngster.phoneNumber,
  });
  tr.appendChild(tdPhone);
  table.appendChild(tr);
};
const moveObjectToLast = (arr, obj) => {
  const index = arr.indexOf(obj);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr.splice(index, 1);
    arr.push(obj);
  }
};
let multiChoice = false;
let selectedRows = [];
const getObjectByNumber = (row, dataArray) => {
  const number = parseInt(row.querySelector(".bodyCell.number").textContent, 10);
  const result = dataArray.find(obj => obj.number === number);
  return result || null;
};
const choseRow = (bodyRows, youngsterList, currentRow) => {
  if (!multiChoice) {
    for (let j = 0; j < bodyRows.length; j++) {
      bodyRows[j].classList.remove("activeRow");
    }
    currentRow.classList.add("activeRow");
    selectedRows = [currentRow];
    showDetails(getObjectByNumber(currentRow, youngsterList));
  } else {
    selectedRows.includes(currentRow) ? "" : showDetails(getObjectByNumber(currentRow, youngsterList));
    moveObjectToLast(selectedRows, currentRow);
    currentRow.classList.add("lastSelectedRow");
    currentRow.classList.remove("activeRow");
    if (selectedRows.length > 1) {
      selectedRows[selectedRows.length - 2].classList.remove("lastSelectedRow");
      selectedRows[selectedRows.length - 2].classList.add("activeRow");
    }
  }
};
const showDetails = youngster => {
  let name = Object.assign(document.createElement("h1"), {
    textContent: `שם: ${youngster.name}`,
    className: "detailsText",
  });
  let hobie = Object.assign(document.createElement("h1"), {
    textContent: `תחביב: ${youngster.specificDetails.hobie}`,
    className: "detailsText",
  });
  let book = Object.assign(document.createElement("h1"), {
    textContent: `ספר: ${youngster.specificDetails.book}`,
    className: "detailsText",
  });
  let textBox = Object.assign(document.createElement("div"), {
    className: `detailsTextBox`,
  });
  if (!multiChoice && document.getElementsByClassName("detailsTextBox").length != 0) {
    textBox = document.getElementsByClassName("detailsTextBox")[0];
  }
  multiChoice
    ? [name, hobie, book].forEach(element => {
        textBox.appendChild(element);
      })
    : textBox.replaceChildren(...[name, hobie, book]);
  let details = document.getElementById("details");
  details.appendChild(textBox);
};
const showTable = () => {
  removeImgs();
  document.getElementById("itemsTable").classList.remove("hidden");
  document.getElementById("multiChoiceButton").classList.remove("hidden");
  const textBoxs = document.querySelectorAll(".detailsTextBox");
  for (let i = 0; i < textBoxs.length; i++) {
    textBoxs[i].classList.remove("hidden");
  }
};
const constractTable = arrayToShow => {
  let table = document.getElementById("itemsTableBody");
  arrayToShow.forEach(youngster => {
    createRow(youngster, table);
  });
  let bodyRows = Array.from(document.getElementsByClassName("bodyRow"));
  bodyRows.forEach(row => {
    row.addEventListener("click", () => {
      choseRow(bodyRows, arrayToShow, row);
    });
  });
};
const removeDetailstextBox = () => {
  let textBoxs = document.querySelectorAll(".detailsTextBox");
  for (let i = 0; i < textBoxs.length - 1; i++) {
    textBoxs[i].remove();
  }
};
const removeMultiChoice = () => {
  let activeRows = document.getElementsByClassName("activeRow");
  let lastSelectedRow = document.getElementsByClassName("lastSelectedRow");
  if (activeRows.length + lastSelectedRow.length > 1) {
    while (activeRows.length > 0) {
      activeRows[0].classList.remove("activeRow");
    }
  }
  if (lastSelectedRow.length === 0) {
    selectedRows = [];
  } else {
    selectedRows = [lastSelectedRow[0]];
    lastSelectedRow[0].classList.add("activeRow");
    lastSelectedRow[0].classList.remove("lastSelectedRow");
  }
  removeDetailstextBox();
};
const hideTable = () => {
  document.getElementById("itemsTable").classList.add("hidden");
  document.getElementById("multiChoiceButton").classList.add("hidden");
  let textBoxs = document.querySelectorAll(".detailsTextBox");
  for (let i = 0; i < textBoxs.length; i++) {
    textBoxs[i].classList.add("hidden");
  }
};
const clearTable = table => {
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
};
const organizeTable = (table, sortBy, asc) => {
  let rows = Array.from(table.rows);
  rows.sort((a, b) => {
    let aValue = a.cells[getColumnIndex(a, sortBy)].textContent.trim();
    let bValue = b.cells[getColumnIndex(b, sortBy)].textContent.trim();
    if (asc) {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  clearTable(table);
  rows.forEach(row => {
    table.appendChild(row);
  });
};
const getColumnIndex = (row, columnName) => {
  let cells = Array.from(row.cells);
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].classList.contains(columnName)) {
      return i;
    }
  }
  console.error("Column not found:", columnName);
  return -1;
};
let currentOrginization = null;
const reorderTable = columnName => {
  if (currentOrginization == columnName) {
    currentOrginization = null;
    organizeTable(document.getElementById("itemsTableBody"), columnName, false);
  } else {
    currentOrginization = columnName;
    organizeTable(document.getElementById("itemsTableBody"), columnName, true);
  }
};
const showSortingArrows = column => {
  document.getElementsByClassName("sortingBox")[0] ? document.getElementsByClassName("sortingBox")[0].remove() : "";
  let sortingBox = Object.assign(document.createElement("div"), {
    className: "sortingBox",
  });
  let sortUp = Object.assign(document.createElement("div"), {
    className: "sortUp",
  });
  let sortDown = Object.assign(document.createElement("div"), {
    className: "sortDown",
  });
  sortingBox.replaceChildren(...[sortUp, sortDown]);
  column.appendChild(sortingBox);
};
let counter = 0;
const handleSortingClick = target => {
  if (counter > 3) {
    console.error("couldnt find order type");
    return -1;
  } else if (target.classList.toString().toLowerCase().includes("sort")) {
    counter++;
    target = handleSortingClick(target.parentElement);
    return target;
  } else {
    counter = 0;
    return target;
  }
};
const removeImgs = () => {
  document.getElementsByClassName("itemImages").length > 0
    ? document.getElementsByClassName("itemImages")[0].remove()
    : "";
};
const showImg = imgName => {
  const img = Object.assign(document.createElement("img"), {
    className: "itemImages",
    src: `./resources/${imgName}.gif`,
    id: `img${imgName}`,
  });
  document.getElementById("items").appendChild(img);
};
window.onload = async () => {
  youngsterList = await getyoungsters();
  constractTable(youngsterList);
  updateTime();
  document.getElementById("clockButton").addEventListener("click", () => {
    keepTimeUpdated();
  });
  let optionsButtons = document.getElementsByClassName("button");
  for (let i = 0; i < optionsButtons.length; i++) {
    optionsButtons[i].addEventListener("click", event => {
      keepPressed(optionsButtons);
    });
  }
  document.getElementById("multiChoiceButton").addEventListener("click", () => {
    multiChoice = !multiChoice;
    multiChoice
      ? document.getElementById("multiChoiceButton").classList.add("multiChoiceButtonPressed")
      : document.getElementById("multiChoiceButton").classList.remove("multiChoiceButtonPressed");
    if (!multiChoice) {
      removeMultiChoice();
    }
  });
  Array.from(document.getElementsByClassName("headerCell")).forEach(cell => {
    cell.addEventListener("click", () => {
      let column = handleSortingClick(event.target);
      reorderTable(column.id);
      showSortingArrows(column);
    });
  });
  Array.from(document.getElementsByClassName("button")).forEach(button => {
    button.addEventListener("click", () => {
      if (event.target.id == "youngs") {
        document.getElementById("itemsTable").classList.contains("hidden") ? showTable() : hideTable();
      } else {
        hideTable();
        removeImgs();
        showImg(event.target.id);
      }
    });
  });
};
