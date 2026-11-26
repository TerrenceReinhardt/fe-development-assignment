const API_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_LIMIT = 5;

// DOM Elements

const postsTableBody = document.getElementById("postsTableBody");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const statusMessage = document.getElementById("statusMessage");

const postModal = document.getElementById("postModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const doneBtn = document.getElementById("doneBtn");

const addPostForm = document.getElementById("addPostForm");
const postTitle = document.getElementById("postTitle");
const postBody = document.getElementById("postBody");
const titleError = document.getElementById("titleError");
const bodyError = document.getElementById("bodyError");
const submitError = document.getElementById("submitError");
const submitPostBtn = document.getElementById("submitPostBtn");
const postResult = document.getElementById("postResult");

// Application State

let currentPage = 1;
let currentSearch = "";
let currentSort = "id";
let currentOrder = "asc";
let totalPages = 1;
let activeRequest = null;
let isSubmitting = false;

// Read URL Parameters

function readURLParameters() {
    const params = new URLSearchParams(window.location.search);

    const page = Number(params.get("_page"));

    currentPage = Number.isInteger(page) && page > 0
        ? page
        : 1;

    currentSearch = params.get("title_like") || "";

    currentSort = params.get("_sort") === "title"
        ? "title"
        : "id";

    currentOrder = params.get("_order") === "desc"
        ? "desc"
        : "asc";

    searchInput.value = currentSearch;
    sortSelect.value = `${currentSort}_${currentOrder}`;
}

// Build Query Parameters

function buildQueryParameters() {
    const params = new URLSearchParams();

    params.set("_page", currentPage);
    params.set("_limit", PAGE_LIMIT);
    params.set("title_like", currentSearch);
    params.set("_sort", currentSort);
    params.set("_order", currentOrder);

    return params;
}

// Update Browser URL

function updateURL(replace = false) {
    const params = buildQueryParameters();

    const newURL =
        `${window.location.pathname}?${params.toString()}`;

    if (replace) {
        window.history.replaceState(null, "", newURL);
    } else {
        window.history.pushState(null, "", newURL);
    }
}

// Fetch Posts Using GET

async function fetchPosts() {
    // Cancel previous request if still running
    if (activeRequest) {
        activeRequest.abort();
    }

    const controller = new AbortController();
    activeRequest = controller;

    statusMessage.textContent = "Loading posts...";
    postsTableBody.replaceChildren();

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    try {
        const params = buildQueryParameters();

        const response = await fetch(
            `${API_URL}?${params.toString()}`,
            {
                method: "GET",
                signal: controller.signal
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const posts = await response.json();

        if (controller.signal.aborted) {
            return;
        }

        const totalCount = response.headers.get("X-Total-Count");

        if (totalCount !== null) {
            totalPages = Math.max(
                1,
                Math.ceil(Number(totalCount) / PAGE_LIMIT)
            );
        } else {
            // Fallback when total count is unavailable
            totalPages = posts.length === PAGE_LIMIT
                ? currentPage + 1
                : currentPage;
        }

        // Handle page numbers outside the available range
        if (currentPage > totalPages) {
            currentPage = totalPages;
            updateURL(true);
            return fetchPosts();
        }

        renderPosts(posts);
        updatePagination();

        statusMessage.textContent = posts.length > 0
            ? `Showing ${posts.length} post(s)`
            : "No posts found.";

    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }

        statusMessage.textContent =
            "Unable to load posts. Please try again.";

        console.error(error);
    }
}

// Render Posts in Table

function renderPosts(posts) {
    postsTableBody.replaceChildren();

    if (posts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 3;
        cell.textContent = "No posts found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        postsTableBody.appendChild(row);

        return;
    }

    posts.forEach(function (post) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = post.id;

        const titleCell = document.createElement("td");
        titleCell.textContent = post.title;

        const bodyCell = document.createElement("td");
        bodyCell.textContent = post.body;

        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(bodyCell);

        postsTableBody.appendChild(row);
    });
}

// Update Pagination

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage}`;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Search Posts

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    currentSearch = searchInput.value.trim();

    // Reset to page 1 when searching
    currentPage = 1;

    updateURL();
    fetchPosts();
});

// Sort Posts

sortSelect.addEventListener("change", function () {
    const [sort, order] = sortSelect.value.split("_");

    currentSort = sort;
    currentOrder = order;

    // Reset to page 1 when sorting
    currentPage = 1;

    updateURL();
    fetchPosts();
});

// Previous Page

prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;

        updateURL();
        fetchPosts();
    }
});

// Next Page

nextBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
        currentPage++;

        updateURL();
        fetchPosts();
    }
});

// Browser Back and Forward Navigation

window.addEventListener("popstate", function () {
    readURLParameters();
    fetchPosts();
});

// Reset Modal

function resetModal() {
    addPostForm.reset();

    titleError.textContent = "";
    bodyError.textContent = "";
    submitError.textContent = "";

    postTitle.classList.remove("invalid");
    postBody.classList.remove("invalid");

    addPostForm.hidden = false;
    postResult.hidden = true;

    submitPostBtn.disabled = false;
    submitPostBtn.textContent = "Submit Post";
}

// Open Modal

openModalBtn.addEventListener("click", function () {
    resetModal();
    postModal.showModal();
    postTitle.focus();
});

// Close Modal

function closeModal() {
    if (!isSubmitting) {
        postModal.close();
    }
}

closeModalBtn.addEventListener("click", closeModal);
doneBtn.addEventListener("click", closeModal);

postModal.addEventListener("cancel", function (event) {
    if (isSubmitting) {
        event.preventDefault();
    }
});

// Client-Side Validation

function validatePost(title, body) {
    let isValid = true;

    titleError.textContent = "";
    bodyError.textContent = "";

    postTitle.classList.remove("invalid");
    postBody.classList.remove("invalid");

    // Title Validation

    if (title === "") {
        titleError.textContent = "Title is required.";
        isValid = false;

    } else if (/\d/.test(title)) {
        titleError.textContent =
            "Title must not contain digits.";

        isValid = false;

    } else if (title.length > 30) {
        titleError.textContent =
            "Title must not exceed 30 characters.";

        isValid = false;
    }

    // Body Validation

    if (body === "") {
        bodyError.textContent = "Body is required.";
        isValid = false;

    } else if (/\d/.test(body)) {
        bodyError.textContent =
            "Body must not contain digits.";

        isValid = false;
    }

    if (titleError.textContent !== "") {
        postTitle.classList.add("invalid");
    }

    if (bodyError.textContent !== "") {
        postBody.classList.add("invalid");
    }

    return isValid;
}

// Create Post Using POST

async function createPost(title, body) {
    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            body: body,
            userId: 1
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create post.");
    }

    return await response.json();
}

// Display Created Post

function displayPostResult(post) {
    document.getElementById("resultId").textContent = post.id;
    document.getElementById("resultTitle").textContent = post.title;
    document.getElementById("resultBody").textContent = post.body;

    addPostForm.hidden = true;
    postResult.hidden = false;
    doneBtn.focus();
}

// Submit Add Post Form

addPostForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (isSubmitting) {
        return;
    }

    const title = postTitle.value.trim();
    const body = postBody.value.trim();

    submitError.textContent = "";

    if (!validatePost(title, body)) {
        return;
    }

    isSubmitting = true;
    submitPostBtn.disabled = true;
    submitPostBtn.textContent = "Submitting...";

    try {
        const newPost = await createPost(title, body);

        displayPostResult(newPost);

    } catch (error) {
        submitError.textContent =
            "Failed to create post. Please try again.";

        console.error(error);

    } finally {
        isSubmitting = false;
        submitPostBtn.disabled = false;
        submitPostBtn.textContent = "Submit Post";
    }
});

// Initialize Application

readURLParameters();
updateURL(true);
fetchPosts();
