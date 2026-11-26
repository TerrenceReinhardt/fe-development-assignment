const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItemBtn");
const shoppingList = document.getElementById("shoppingList");

function addItem() {
    const itemName = itemInput.value.trim();

    if (itemName === "") {
        alert("Please enter an item name!");
        return;
    }

    const row = document.createElement("tr");

    const itemCell = document.createElement("td");
    itemCell.textContent = itemName;

    const actionCell = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function () {
        row.remove();
    });

    actionCell.appendChild(deleteBtn);
    row.appendChild(itemCell);
    row.appendChild(actionCell);
    shoppingList.appendChild(row);

    itemInput.value = "";
    itemInput.focus();
}

addItemBtn.addEventListener("click", addItem);
