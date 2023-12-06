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
        className: `bodyCell`,
        textContent: youngster.number
    })
    tr.appendChild(tdNumber)
    let tdName = Object.assign(document.createElement("td"), {
        className: `bodyCell`,
        textContent: youngster.name
    })
    tr.appendChild(tdName)
    let tdResidance = Object.assign(document.createElement("td"), {
        className: `bodyCell`,
        textContent: youngster.residance
    })
    tr.appendChild(tdResidance)
    let tdPhone = Object.assign(document.createElement("td"), {
        className: `bodyCell`,
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

const showTable = () => {
    document.getElementById("itemsTable").classList.remove("hidden")
    let table = document.getElementById("itemsTableBody")
    youngsterList.forEach((youngster) => {
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

const removeDetailstextBox = () => {
    let textBoxs = document.querySelectorAll(".detailsTextBox")
   textBoxs.forEach((box)=>{
    box.remove()
   })
}

const removeMultiChoice = () => {
    let activeRows = document.getElementsByClassName("activeRow")
    for (let index = 0; index < activeRows.length; index++) {
        activeRows[index].classList.remove("activeRow");
    }

    let lastSelectedRow = document.getElementsByClassName("lastSelectedRow");
    let detailsTextBox = document.getElementsByClassName("detailsTextBox")
    console.log(detailsTextBox);
    let rowToDelete = detailsTextBox.length;
    console.log(rowToDelete);
    if (lastSelectedRow.length > 0) {
        lastSelectedRow[0].classList.add("activeRow");
        lastSelectedRow[0].classList.remove("lastSelectedRow");
        rowToDelete = lastSelectedRow.length - 1;
    }
    console.log(detailsTextBox[0]);
    removeDetailstextBox()
    // for (let index = 0; index < rowToDelete; index++) {
    //     detailsTextBox[index].remove()
    // }


}


const hideTable = () => {
    multiChoice = false;
    document.getElementById("multiChoiceButton").classList.remove("multiChoiceButtonPressed");
    selectedRows = [];
    document.getElementById("itemsTable").classList.add("hidden")
    let table = document.getElementById("itemsTableBody")
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    removeDetailstextBox()
        document.getElementById("multiChoiceButton").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    updateTime();
    document.getElementById("clockButton").addEventListener("click", () => {
        keepTimeUpdated()
    });
    document.getElementById("youngs").addEventListener("click", () => {
        document.getElementById("itemsTable").classList.contains("hidden") ? showTable() : hideTable();
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
});