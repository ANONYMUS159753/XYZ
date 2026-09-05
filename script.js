// ======================================
// STUDYVAULT
// ======================================


// --------------------------------------
// DOM ELEMENTS
// --------------------------------------

const noteTitle =
    document.getElementById("noteTitle");

const subject =
    document.getElementById("subject");

const description =
    document.getElementById("description");

const noteImage =
    document.getElementById("noteImage");

const chooseFileButton =
    document.getElementById("chooseFileButton");

const dropZone =
    document.getElementById("dropZone");

const previewContainer =
    document.getElementById("previewContainer");

const imagePreview =
    document.getElementById("imagePreview");

const removeImageButton =
    document.getElementById("removeImageButton");

const saveNoteButton =
    document.getElementById("saveNoteButton");

const notesContainer =
    document.getElementById("notesContainer");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filterSubject =
    document.getElementById("filterSubject");

const sortNotes =
    document.getElementById("sortNotes");

const clearAllButton =
    document.getElementById("clearAllButton");

const themeButton =
    document.getElementById("themeButton");

const themeIcon =
    document.getElementById("themeIcon");

const quickUploadButton =
    document.getElementById("quickUploadButton");

const emptyUploadButton =
    document.getElementById("emptyUploadButton");

const totalNotes =
    document.getElementById("totalNotes");

const favouriteNotes =
    document.getElementById("favouriteNotes");

const totalSubjects =
    document.getElementById("totalSubjects");

const latestUpload =
    document.getElementById("latestUpload");

const toast =
    document.getElementById("toast");

const editModal =
    document.getElementById("editModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const editTitle =
    document.getElementById("editTitle");

const editSubject =
    document.getElementById("editSubject");

const editDescription =
    document.getElementById("editDescription");

const saveEditButton =
    document.getElementById("saveEditButton");


// --------------------------------------
// APPLICATION DATA
// --------------------------------------

let notes =
    JSON.parse(
        localStorage.getItem("studyVaultNotes")
    ) || [];


let selectedImage = null;

let editingNoteId = null;


// --------------------------------------
// INITIALISE APPLICATION
// --------------------------------------

loadTheme();

displayNotes();

updateDashboard();


// --------------------------------------
// FILE BUTTON
// --------------------------------------

chooseFileButton.addEventListener(

    "click",

    function () {

        noteImage.click();

    }

);


// --------------------------------------
// IMAGE SELECTION
// --------------------------------------

noteImage.addEventListener(

    "change",

    function () {

        const file =
            noteImage.files[0];

        handleImage(file);

    }

);


// --------------------------------------
// DRAG AND DROP
// --------------------------------------

dropZone.addEventListener(

    "dragover",

    function (event) {

        event.preventDefault();

        dropZone.classList.add(
            "dragging"
        );

    }

);


dropZone.addEventListener(

    "dragleave",

    function () {

        dropZone.classList.remove(
            "dragging"
        );

    }

);


dropZone.addEventListener(

    "drop",

    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

        const file =
            event.dataTransfer.files[0];

        handleImage(file);

    }

);


// --------------------------------------
// HANDLE IMAGE
// --------------------------------------

function handleImage(file) {

    if (!file) {

        return;

    }


    if (
        !file.type.startsWith("image/")
    ) {

        showToast(
            "Please upload an image file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            selectedImage =
                event.target.result;

            imagePreview.src =
                selectedImage;

            previewContainer.classList.remove(
                "hidden"
            );

        };


    reader.readAsDataURL(file);

}


// --------------------------------------
// REMOVE IMAGE
// --------------------------------------

removeImageButton.addEventListener(

    "click",

    function () {

        selectedImage = null;

        noteImage.value = "";

        imagePreview.src = "";

        previewContainer.classList.add(
            "hidden"
        );

    }

);


// --------------------------------------
// SAVE NOTE
// --------------------------------------

saveNoteButton.addEventListener(

    "click",

    function () {

        const title =
            noteTitle.value.trim();

        const noteSubject =
            subject.value;

        const noteDescription =
            description.value.trim();


        if (!title) {

            showToast(
                "Please enter a note title."
            );

            return;

        }


        if (!noteDescription) {

            showToast(
                "Please enter a description."
            );

            return;

        }


        if (!selectedImage) {

            showToast(
                "Please upload a note image."
            );

            return;

        }


        const newNote = {

            id:
                Date.now(),

            title:
                title,

            subject:
                noteSubject,

            description:
                noteDescription,

            image:
                selectedImage,

            favourite:
                false,

            createdAt:
                new Date().toISOString()

        };


        notes.push(
            newNote
        );


        saveNotes();

        clearUploadForm();

        displayNotes();

        updateDashboard();

        showToast(
            "Study note saved successfully! 📚"
        );

    }

);


// --------------------------------------
// SAVE NOTES
// --------------------------------------

function saveNotes() {

    localStorage.setItem(

        "studyVaultNotes",

        JSON.stringify(notes)

    );

}


// --------------------------------------
// CLEAR FORM
// --------------------------------------

function clearUploadForm() {

    noteTitle.value = "";

    subject.value = "General";

    description.value = "";

    noteImage.value = "";

    selectedImage = null;

    imagePreview.src = "";

    previewContainer.classList.add(
        "hidden"
    );

}


// --------------------------------------
// DISPLAY NOTES
// --------------------------------------

function displayNotes() {

    const searchText =
        searchInput.value
        .toLowerCase()
        .trim();


    const selectedSubject =
        filterSubject.value;


    const selectedSort =
        sortNotes.value;


    let filteredNotes =
        notes.filter(

            function (note) {

                const matchesSearch =

                    note.title
                    .toLowerCase()
                    .includes(searchText)

                    ||

                    note.description
                    .toLowerCase()
                    .includes(searchText)

                    ||

                    note.subject
                    .toLowerCase()
                    .includes(searchText);


                const matchesSubject =

                    selectedSubject === "All"

                    ||

                    note.subject ===
                    selectedSubject;


                return
                    matchesSearch &&
                    matchesSubject;

            }

        );


    filteredNotes =
        sortNotesList(

            filteredNotes,

            selectedSort

        );


    notesContainer.innerHTML = "";


    if (
        filteredNotes.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    filteredNotes.forEach(

        function (note) {

            const card =
                document.createElement("article");


            card.className =
                "note-card";


            card.innerHTML = `

                <img
                    class="note-image"
                    src="${note.image}"
                    alt="${escapeHTML(note.title)}"
                >


                <div class="note-content">


                    <div class="note-meta">


                        <span
                            class="subject-badge">

                            ${escapeHTML(note.subject)}

                        </span>


                        <button
                            class="star-button"
                            data-id="${note.id}">

                            ${note.favourite ? "⭐" : "☆"}

                        </button>


                    </div>


                    <h3>

                        ${escapeHTML(note.title)}

                    </h3>


                    <p>

                        ${escapeHTML(note.description)}

                    </p>


                    <div class="note-date">

                        📅
                        ${formatDate(note.createdAt)}

                    </div>


                    <div
                        class="note-actions">


                        <button
                            class="edit-button"
                            data-id="${note.id}">

                            ✏️ Edit

                        </button>


                        <button
                            class="delete-button"
                            data-id="${note.id}">

                            🗑️ Delete

                        </button>


                    </div>


                </div>

            `;


            notesContainer.appendChild(
                card
            );

        }

    );


    attachCardEvents();

}


// --------------------------------------
// SORT NOTES
// --------------------------------------

function sortNotesList(
    list,
    type
) {

    const sorted =
        [...list];


    if (type === "newest") {

        sorted.sort(

            (a, b) =>

                new Date(b.createdAt)
                -
                new Date(a.createdAt)

        );

    }


    else if (type === "oldest") {

        sorted.sort(

            (a, b) =>

                new Date(a.createdAt)
                -
                new Date(b.createdAt)

        );

    }


    else if (type === "title") {

        sorted.sort(

            (a, b) =>

                a.title.localeCompare(
                    b.title
                )

        );

    }


    else if (type === "favourites") {

        sorted.sort(

            (a, b) =>

                Number(b.favourite)
                -
                Number(a.favourite)

        );

    }


    return sorted;

}


// --------------------------------------
// CARD EVENTS
// --------------------------------------

function attachCardEvents() {


    const starButtons =
        document.querySelectorAll(
            ".star-button"
        );


    const editButtons =
        document.querySelectorAll(
            ".edit-button"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-button"
        );


    starButtons.forEach(

        function (button) {

            button.addEventListener(

                "click",

                function () {

                    toggleFavourite(

                        Number(
                            button.dataset.id
                        )

                    );

                }

            );

        }

    );


    editButtons.forEach(

        function (button) {

            button.addEventListener(

                "click",

                function () {

                    openEditModal(

                        Number(
                            button.dataset.id
                        )

                    );

                }

            );

        }

    );


    deleteButtons.forEach(

        function (button) {

            button.addEventListener(

                "click",

                function () {

                    deleteNote(

                        Number(
                            button.dataset.id
                        )

                    );

                }

            );

        }

    );

}


// --------------------------------------
// FAVOURITE
// --------------------------------------

function toggleFavourite(id) {

    const note =
        notes.find(

            function (item) {

                return item.id === id;

            }

        );


    if (!note) {

        return;

    }


    note.favourite =
        !note.favourite;


    saveNotes();

    displayNotes();

    updateDashboard();

}


// --------------------------------------
// DELETE NOTE
// --------------------------------------

function deleteNote(id) {

    const note =
        notes.find(

            item => item.id === id

        );


    if (!note) {

        return;

    }


    const confirmed =
        confirm(

            `Delete "${note.title}"?`

        );


    if (!confirmed) {

        return;

    }


    notes =
        notes.filter(

            item => item.id !== id

        );


    saveNotes();

    displayNotes();

    updateDashboard();

    showToast(
        "Note deleted."
    );

}


// --------------------------------------
// EDIT MODAL
// --------------------------------------

function openEditModal(id) {

    const note =
        notes.find(

            item => item.id === id

        );


    if (!note) {

        return;

    }


    editingNoteId = id;


    editTitle.value =
        note.title;


    editSubject.value =
        note.subject;


    editDescription.value =
        note.description;


    editModal.classList.remove(
        "hidden"
    );

}


// --------------------------------------
// CLOSE MODAL
// --------------------------------------

closeModalButton.addEventListener(

    "click",

    function () {

        editModal.classList.add(
            "hidden"
        );

        editingNoteId = null;

    }

);


// --------------------------------------
// SAVE EDIT
// --------------------------------------

saveEditButton.addEventListener(

    "click",

    function () {

        const note =
            notes.find(

                item =>
                    item.id === editingNoteId

            );


        if (!note) {

            return;

        }


        note.title =
            editTitle.value.trim();


        note.subject =
            editSubject.value;


        note.description =
            editDescription.value.trim();


        saveNotes();

        displayNotes();

        updateDashboard();


        editModal.classList.add(
            "hidden"
        );


        showToast(
            "Changes saved successfully!"
        );

    }

);


// --------------------------------------
// SEARCH / FILTER / SORT
// --------------------------------------

searchInput.addEventListener(

    "input",

    displayNotes

);


filterSubject.addEventListener(

    "change",

    displayNotes

);


sortNotes.addEventListener(

    "change",

    displayNotes

);


// --------------------------------------
// CLEAR ALL
// --------------------------------------

clearAllButton.addEventListener(

    "click",

    function () {

        if (notes.length === 0) {

            showToast(
                "There are no notes to delete."
            );

            return;

        }


        const confirmed =
            confirm(

                "Are you sure you want to delete all notes?"

            );


        if (!confirmed) {

            return;

        }


        notes = [];


        saveNotes();

        displayNotes();

        updateDashboard();


        showToast(
            "All notes were deleted."
        );

    }

);


// --------------------------------------
// DASHBOARD
// --------------------------------------

function updateDashboard() {

    totalNotes.textContent =
        notes.length;


    const favouriteCount =
        notes.filter(

            note => note.favourite

        ).length;


    favouriteNotes.textContent =
        favouriteCount;


    const subjects =
        new Set(

            notes.map(

                note => note.subject

            )

        );


    totalSubjects.textContent =
        subjects.size;


    if (notes.length === 0) {

        latestUpload.textContent =
            "--";

        return;

    }


    const newest =
        [...notes]
        .sort(

            (a, b) =>

                new Date(b.createdAt)
                -
                new Date(a.createdAt)

        )[0];


    latestUpload.textContent =
        formatDate(
            newest.createdAt
        );

}


// --------------------------------------
// THEME
// --------------------------------------

themeButton.addEventListener(

    "click",

    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        const darkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(

            "studyVaultTheme",

            darkMode
                ? "dark"
                : "light"

        );


        updateThemeIcon();

    }

);


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "studyVaultTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    updateThemeIcon();

}


function updateThemeIcon() {

    if (

        document.body.classList.contains(
            "dark-mode"
        )

    ) {

        themeIcon.textContent =
            "☀️";

    }

    else {

        themeIcon.textContent =
            "🌙";

    }

}


// --------------------------------------
// QUICK UPLOAD
// --------------------------------------

quickUploadButton.addEventListener(

    "click",

    function () {

        document
            .getElementById("upload")
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }

);


emptyUploadButton.addEventListener(

    "click",

    function () {

        document
            .getElementById("upload")
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }

);


// --------------------------------------
// TOAST
// --------------------------------------

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(

        function () {

            toast.classList.remove(
                "show"
            );

        },

        3000

    );

}


// --------------------------------------
// FORMAT DATE
// --------------------------------------

function formatDate(date) {

    const formatted =
        new Date(date);


    return formatted.toLocaleDateString(

        undefined,

        {

            day:
                "numeric",

            month:
                "short",

            year:
                "numeric"

        }

    );

}


// --------------------------------------
// PREVENT HTML INJECTION
// --------------------------------------

function escapeHTML(text) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}
