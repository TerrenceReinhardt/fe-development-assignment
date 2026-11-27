const transactions = [
    { id: "TXN00001", customer: "Alice Johnson", amount: 1200.50, date: "2025-04-01", type: "credit" },
    { id: "TXN00002", customer: "Bob Smith", amount: 750, date: "2025-04-03", type: "debit" },
    { id: "TXN00003", customer: "Charlie Brown", amount: 2500, date: "2025-04-02", type: "credit" },
    { id: "TXN00004", customer: "Diana Wilson", amount: 450, date: "2025-04-05", type: "debit" },
    { id: "TXN00005", customer: "Ethan Davis", amount: 3200, date: "2025-04-04", type: "credit" },
    { id: "TXN00006", customer: "Fiona Clark", amount: 890, date: "2025-04-08", type: "debit" },
    { id: "TXN00007", customer: "George Miller", amount: 1800, date: "2025-04-06", type: "credit" },
    { id: "TXN00008", customer: "Hannah Lee", amount: 650, date: "2025-04-07", type: "debit" },
    { id: "TXN00009", customer: "Ian Taylor", amount: 4100, date: "2025-04-10", type: "credit" },
    { id: "TXN00010", customer: "Julia Moore", amount: 950, date: "2025-04-09", type: "debit" },
    { id: "TXN00011", customer: "Kevin White", amount: 2750, date: "2025-04-12", type: "credit" },
    { id: "TXN00012", customer: "Laura Martin", amount: 500, date: "2025-04-11", type: "debit" },
    { id: "TXN00013", customer: "Michael Hall", amount: 3600, date: "2025-04-15", type: "credit" },
    { id: "TXN00014", customer: "Nina Allen", amount: 1100, date: "2025-04-13", type: "debit" },
    { id: "TXN00015", customer: "Oscar Young", amount: 2200, date: "2025-04-14", type: "credit" },
    { id: "TXN00016", customer: "Paula King", amount: 780, date: "2025-04-18", type: "debit" },
    { id: "TXN00017", customer: "Quinn Wright", amount: 5400, date: "2025-04-16", type: "credit" },
    { id: "TXN00018", customer: "Rachel Scott", amount: 1350, date: "2025-04-17", type: "debit" },
    { id: "TXN00019", customer: "Samuel Green", amount: 1900, date: "2025-04-20", type: "credit" },
    { id: "TXN00020", customer: "Tina Adams", amount: 620, date: "2025-04-19", type: "debit" },
    { id: "TXN00021", customer: "Uma Baker", amount: 4800, date: "2025-04-22", type: "credit" },
    { id: "TXN00022", customer: "Victor Hill", amount: 1550, date: "2025-04-21", type: "debit" },
    { id: "TXN00023", customer: "Wendy Nelson", amount: 2900, date: "2025-04-25", type: "credit" },
    { id: "TXN00024", customer: "Xavier Carter", amount: 850, date: "2025-04-23", type: "debit" },
    { id: "TXN00025", customer: "Yvonne Mitchell", amount: 3750, date: "2025-04-24", type: "credit" }
];

let displayedTransactions = [...transactions];

const transactionTable = document.getElementById("transactionTable");
const sortAlgorithm = document.getElementById("sortAlgorithm");
const sortField = document.getElementById("sortField");
const sortOrder = document.getElementById("sortOrder");
const searchAlgorithm = document.getElementById("searchAlgorithm");
const searchInput = document.getElementById("searchInput");
const resultMessage = document.getElementById("resultMessage");
const algorithmInfo = document.getElementById("algorithmInfo");

const sortBtn = document.getElementById("sortBtn");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}

function renderTransactions(data) {
    transactionTable.innerHTML = "";

    if (data.length === 0) {
        transactionTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    Transaction not found.
                </td>
            </tr>
        `;

        resultMessage.textContent = "Showing 0 transactions.";
        return;
    }

    transactionTable.innerHTML = data.map(transaction => `
        <tr>
            <td>${transaction.id}</td>
            <td>${transaction.customer}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td>${transaction.date}</td>
            <td>
                <span class="type ${transaction.type}">
                    ${transaction.type}
                </span>
            </td>
        </tr>
    `).join("");

    resultMessage.textContent =
        `Showing ${data.length} transaction(s).`;
}

function updateSummary() {
    const totalCredit = transactions
        .filter(transaction => transaction.type === "credit")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const totalDebit = transactions
        .filter(transaction => transaction.type === "debit")
        .reduce((total, transaction) => total + transaction.amount, 0);

    document.getElementById("totalTransactions").textContent =
        transactions.length;

    document.getElementById("totalCredit").textContent =
        formatCurrency(totalCredit);

    document.getElementById("totalDebit").textContent =
        formatCurrency(totalDebit);
}


// Compare transaction values
function compareTransactions(first, second, field, order) {
    let comparison;

    if (typeof first[field] === "string") {
        comparison = first[field].localeCompare(second[field]);
    } else {
        comparison = first[field] - second[field];
    }

    return order === "asc" ? comparison : -comparison;
}

// Bubble Sort
function bubbleSort(data, field, order) {
    const sortedData = [...data];

    for (let i = 0; i < sortedData.length - 1; i++) {
        let swapped = false;

        for (let j = 0; j < sortedData.length - i - 1; j++) {
            if (
                compareTransactions(
                    sortedData[j],
                    sortedData[j + 1],
                    field,
                    order
                ) > 0
            ) {
                [sortedData[j], sortedData[j + 1]] =
                    [sortedData[j + 1], sortedData[j]];

                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return sortedData;
}

// Merge Sort
function mergeSort(data, field, order) {
    if (data.length <= 1) {
        return [...data];
    }

    const middle = Math.floor(data.length / 2);

    const left = mergeSort(
        data.slice(0, middle), field, order
    );

    const right = mergeSort(
        data.slice(middle), field, order
    );

    return merge(left, right, field, order);
}

// Merge two sorted arrays
function merge(left, right, field, order) {
    const result = [];

    let leftIndex = 0;
    let rightIndex = 0;

    while (
        leftIndex < left.length &&
        rightIndex < right.length
    ) {
        if (
            compareTransactions(
                left[leftIndex],
                right[rightIndex],
                field,
                order
            ) <= 0
        ) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(
        left.slice(leftIndex),
        right.slice(rightIndex)
    );
}


// Linear Search by customer name
function linearSearch(data, query) {
    const results = [];
    const keyword = query.toLowerCase();

    for (let i = 0; i < data.length; i++) {
        const customerName = data[i].customer.toLowerCase();

        if (customerName.includes(keyword)) {
            results.push(data[i]);
        }
    }

    return results;
}

// Binary Search by transaction ID
function binarySearch(data, query) {
    const sortedData = mergeSort(data, "id", "asc");
    const targetId = query.toUpperCase();

    let left = 0;
    let right = sortedData.length - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const currentId = sortedData[middle].id;

        if (currentId === targetId) {
            return [sortedData[middle]];
        }

        if (currentId < targetId) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return [];
}



// Sort button
sortBtn.addEventListener("click", function () {
    const algorithm = sortAlgorithm.value;
    const field = sortField.value;
    const order = sortOrder.value;

    if (algorithm === "bubble") {
        displayedTransactions = bubbleSort(
            displayedTransactions, field, order
        );

        algorithmInfo.textContent =
            "Bubble Sort — Average/Worst: O(n²), Best: O(n)";
    } else {
        displayedTransactions = mergeSort(
            displayedTransactions, field, order
        );

        algorithmInfo.textContent =
            "Merge Sort — Time Complexity: O(n log n)";
    }

    renderTransactions(displayedTransactions);
});

// Search functionality
function handleSearch() {
    const query = searchInput.value.trim();
    const algorithm = searchAlgorithm.value;

    if (query === "") {
        displayedTransactions = [...transactions];
        algorithmInfo.textContent = "";
        renderTransactions(displayedTransactions);
        return;
    }

    if (algorithm === "linear") {
        displayedTransactions = linearSearch(
            transactions, query
        );

        algorithmInfo.textContent =
            "Linear Search — Time Complexity: O(n)";
    } else {
        displayedTransactions = binarySearch(
            transactions, query
        );

        algorithmInfo.textContent =
            "Binary Search — O(log n), plus O(n log n) sorting";
    }

    renderTransactions(displayedTransactions);
}

// Search button
searchBtn.addEventListener("click", handleSearch);

// Search using Enter key
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Change search input placeholder
searchAlgorithm.addEventListener("change", function () {
    searchInput.value = "";

    if (searchAlgorithm.value === "linear") {
        searchInput.placeholder = "Enter customer name...";
    } else {
        searchInput.placeholder = "Enter ID (e.g. TXN00001)...";
    }
});

// Reset button
resetBtn.addEventListener("click", function () {
    displayedTransactions = [...transactions];

    searchInput.value = "";
    sortAlgorithm.value = "bubble";
    sortField.value = "amount";
    sortOrder.value = "asc";
    searchAlgorithm.value = "linear";

    searchInput.placeholder = "Enter customer name...";
    algorithmInfo.textContent = "";

    renderTransactions(displayedTransactions);
});

// Initialize application
updateSummary();
renderTransactions(displayedTransactions);
