const updateTime = () => {
    let clock = document.getElementById("clock");
    clock.textContent = new Date().toLocaleTimeString();
}

let runningId;

const keepTimeUpdated = () => {
    if (runningId != undefined) {
        clearInterval(runningId);
        event.target.innerText = 'הפעל'
        runningId = undefined;
    } else {
        updateTime();
        runningId = setInterval(updateTime, 1000);
        event.target.innerText = 'עצור'
    }
}

const keepPressed = (optionsButtons) => {
    if (event.target.classList.contains("pressed")) {
        event.target.classList.remove("pressed");
    } else {
        for (let i = 0; i < optionsButtons.length; i++) {
            optionsButtons[i].classList.remove("pressed");
        }
        event.target.classList.add("pressed");
    }
}

let youngsterList = [{
        name: 'חבר פרבר',
        number: 1,
        phoneNumber: '058-5678444',
        residance: 'פני חבר',
        specificDetails: {
            hobie: 'בילויים',

            book: 'חדוו"א 1'
        }
    },
    {
        name: 'עדי שטיינר',
        number: 46,
        phoneNumber: '051-1234567',
        residance: 'להבים',
        specificDetails: {
            hobie: 'בילויים',
            book: 'חדוו"א 2'
        }
    },
    {
        name: 'סאני סימן טוב',
        number: 99,
        phoneNumber: '012-1234567',
        residance: 'חולון',
        specificDetails: {
            hobie: 'בילויים',
            book: 'חדוו"א 3'
        }
    }
]


const createRow = (youngster, table) => {
    let tr = Object.assign(document.createElement("tr"), {
        className: "bodyRow"
    });
    let tdNumber = Object.assign(document.createElement("td"), {
        className: `bodyCell number`,
        textContent: youngster.number
    })
    tr.appendChild(tdNumber)
    let tdName = Object.assign(document.createElement("td"), {
        className: `bodyCell name`,
        textContent: youngster.name
    })
    tr.appendChild(tdName)
    let tdResidance = Object.assign(document.createElement("td"), {
        className: `bodyCell residance`,
        textContent: youngster.residance
    })
    tr.appendChild(tdResidance)
    let tdPhone = Object.assign(document.createElement("td"), {
        className: `bodyCell phoneNumber`,
        textContent: youngster.phoneNumber
    })
    tr.appendChild(tdPhone)
    table.appendChild(tr)
}

let multiChoice = false;
let selectedRows = [];
const choseRow = (index, bodyRows) => {
    if (!multiChoice) {
        for (let j = 0; j < bodyRows.length; j++) {
            bodyRows[j].classList.remove("activeRow");
        }
        bodyRows[index].classList.add("activeRow");
        selectedRows = [bodyRows[index]]
        showDetails(index)
    } else if (!bodyRows[index].classList.contains("activeRow") && !bodyRows[index].classList.contains("lastSelectedRow")) {
        selectedRows.push(bodyRows[index])
        bodyRows[index].classList.add("lastSelectedRow");
        if (selectedRows.length > 1) {
            selectedRows[selectedRows.length - 2].classList.remove("lastSelectedRow");
            selectedRows[selectedRows.length - 2].classList.add("activeRow");
        }
        showDetails(index)
    }
}

const showDetails = (index) => {
    let youngster = youngsterList[index];
    let name = Object.assign(document.createElement("h1"), {
        textContent: `שם: ${youngster.name}`,
        className: "detailsText"
    });
    let hobie = Object.assign(document.createElement("h1"), {
        textContent: `תחביב: ${youngster.specificDetails.hobie}`,
        className: "detailsText"
    });
    let book = Object.assign(document.createElement("h1"), {
        textContent: `ספר: ${youngster.specificDetails.book}`,
        className: "detailsText"
    });
    let textBox = Object.assign(document.createElement("div"), {
        className: `detailsTextBox`,
    })

    if (!multiChoice && document.getElementsByClassName("detailsTextBox").length != 0) {
        textBox = document.getElementsByClassName("detailsTextBox")[0]
    }

    multiChoice ? [name, hobie, book].forEach((element) => {
        textBox.appendChild(element)
    }) : textBox.replaceChildren(...[name, hobie, book])
    let details = document.getElementById("details")
    details.appendChild(textBox)
}

const showTable = (arrayToShow) => {
    document.getElementById("itemsTable").classList.remove("hidden")
    let table = document.getElementById("itemsTableBody")
    arrayToShow.forEach((youngster) => {
        createRow(youngster, table)
    });
    document.getElementById("multiChoiceButton").classList.remove("hidden")
    let bodyRows = document.getElementsByClassName("bodyRow")
    for (let i = 0; i < bodyRows.length; i++) {
        bodyRows[i].addEventListener("click", () => {
            choseRow(i, bodyRows);
        });
    }

}

const removeDetailstextBox = (skip) => {
    let textBoxs = document.querySelectorAll(".detailsTextBox")
    for (let i = 0; i < textBoxs.length; i++) {
        if (i != skip) {
            textBoxs[i].remove()
        }

    }
}

const removeMultiChoice = () => {
    let activeRows = document.getElementsByClassName("activeRow")
    for (let index = 0; index < activeRows.length; index++) {
        activeRows[index].classList.remove("activeRow");
    }
    let lastSelectedRow = document.getElementsByClassName("lastSelectedRow");
    let rowToskip = null;
    if (lastSelectedRow.length > 0) {
        lastSelectedRow[0].classList.add("activeRow");
        lastSelectedRow[0].classList.remove("lastSelectedRow");
        rowToskip = activeRows.length - 1;
    }
    removeDetailstextBox(rowToskip)
}


const hideTable = (dontHideText) => {
    multiChoice = false;
    document.getElementById("multiChoiceButton").classList.remove("multiChoiceButtonPressed");
    selectedRows = [];
    document.getElementById("itemsTable").classList.add("hidden")
    let table = document.getElementById("itemsTableBody")
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    document.getElementById("multiChoiceButton").classList.add("hidden");
}


const clearTable = (table) => {
    let rowCount = table.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

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
    rows.forEach((row) => {
        table.appendChild(row);
    });
}

const getColumnIndex = (row, columnName) => {
    let cells = Array.from(row.cells);
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains(columnName)) {
            return i;
        }
    }
    console.error('Column not found:', columnName);
    return -1;
}

let currentOrginization = null;
const reorderTable = (columnName) => {

    if (currentOrginization == columnName) {
        currentOrginization = null;
        organizeTable(document.getElementById("itemsTableBody"), columnName, false);
    } else {
        currentOrginization = columnName;
        organizeTable(document.getElementById("itemsTableBody"), columnName, true);
    }

}

const showArrows = (column) => {
    document.getElementById("arrowsHolder") ? document.getElementById("arrowsHolder").remove() : ""
    let arrowsHolder = Object.assign(document.createElement("div"), {
        className: "arrowsHolder"
    })
    let arrowUp = Object.assign(document.createElement("div"), {
        className: "arrowUp",
    })
    let arrowDown = Object.assign(document.createElement("div"), {
        className: "arrowDown",
    })
    arrowsHolder.replaceChildren(...[arrowUp, arrowDown]);
    column.appendChild(arrowsHolder);
}
let counter = 0;
const handleArrowClick = (target) => {
    if (counter > 3) {
        console.error("couldnt find order type")
        return -1;
    } else if (target.classList.toString().toLowerCase().includes("arrow")) {
        counter++;
        target = handleArrowClick(target.parentElement);
        return target;
    } else {
        counter = 0;
        return target;
    }


}

document.addEventListener("DOMContentLoaded", () => {
    updateTime();
    document.getElementById("clockButton").addEventListener("click", () => {
        keepTimeUpdated()
    });
    document.getElementById("youngs").addEventListener("click", () => {
        document.getElementById("itemsTable").classList.contains("hidden") ? showTable(youngsterList) : hideTable();
    })
    let optionsButtons = document.getElementsByClassName("button");
    for (let i = 0; i < optionsButtons.length; i++) {
        optionsButtons[i].addEventListener("click", (event) => {
            keepPressed(optionsButtons);
        })
    }

    document.getElementById("multiChoiceButton").addEventListener("click", () => {
        multiChoice = !multiChoice;
        multiChoice ? document.getElementById("multiChoiceButton").classList.add("multiChoiceButtonPressed") :
            document.getElementById("multiChoiceButton").classList.remove("multiChoiceButtonPressed");

        if (!multiChoice) {
            removeMultiChoice();

        }
    });
    Array.from(document.getElementsByClassName("headerCell")).forEach((cell) => {
        cell.addEventListener("click", () => {
            let column = handleArrowClick(event.target);
            reorderTable(column.id);
            showArrows(column);
        });
    });
});