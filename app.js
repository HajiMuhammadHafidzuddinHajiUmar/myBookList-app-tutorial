// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static createTableRow(book) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="d-flex justify-content-center gap-3">
                <button type="button" class="btn d-flex align-items-center update" 
                    data-bs-toggle="modal" data-bs-target="#updateModal" data-bs-edit="${book.title}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>          
                <a class="btn text-danger d-flex align-items-center delete" href="#">
                    <i class="fa-solid fa-trash"></i>
                </a>
            </td>
        `;

        return row;
    }

    static addBookToList(book) {
        const List = document.querySelector("#book-list");
        const row = UI.createTableRow(book);

        List.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `container alert alert-${className}`;
        div.innerText = message;

        form.insertAdjacentElement("beforebegin", div);

        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// Store class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem("books", JSON.stringify(books));
    }

    static updateBook(isbn, newBook) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1, newBook);
            }
        })

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// Event: Add a book
const form = document.querySelector("#book-form");
form.addEventListener("submit", submitNewBook);

function submitNewBook(e) {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Please fill in all the fields", "danger");
    } else {
        const newBook = new Book(title, author, isbn);

        UI.addBookToList(newBook);
        Store.addBook(newBook);

        UI.showAlert("Successfully added book to list", "success");

        UI.clearFields();
    }
}

// Event: Remove a book - event propogation
const bookList = document.querySelector("#book-list");
bookList.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
        UI.deleteBook(e.target);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);    // to target the isbn

        UI.showAlert("Book removed", "success");
    }
})

// Event: Update a book - modal form
const updateModal = document.querySelector("#updateModal");
updateModal.addEventListener("show.bs.modal", e => {
    let editBtn = e.relatedTarget;
    console.log("editBtn clicked");

    let bookTitle = editBtn.getAttribute("data-bs-edit") && editBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    let bookAuthor = editBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
    let bookIsbn = editBtn.parentElement.previousElementSibling.textContent;

    const modalLabel = updateModal.querySelector("#updateModalLabel");
    const modalTitleInput = updateModal.querySelector("#title-update");
    const modalAuthorInput = updateModal.querySelector("#author-update");
    const modalIsbnInput = updateModal.querySelector("#isbn-update");

    modalLabel.innerHTML = `Edit <strong>${bookTitle}</strong>`;
    modalTitleInput.value = bookTitle;
    modalAuthorInput.value = bookAuthor;
    modalIsbnInput.value = bookIsbn;

    const updateForm = document.querySelector("#book-update-form");

    const submitForm = (event) => {
        event.preventDefault();

        if (modalTitleInput.value === "" || modalAuthorInput.value === "" || modalIsbnInput.value === "") {
            UI.showAlert("Please fill all fields in the edit form", "danger")
        } else {
            const newBook = new Book(modalTitleInput.value, modalAuthorInput.value, modalIsbnInput.value);

            // Replace UI
            let oldElement = editBtn.parentElement.parentElement;
            const row = UI.createTableRow(newBook);
            oldElement.replaceWith(row);

            // Replace localStorage
            Store.updateBook(editBtn.parentElement.previousElementSibling.textContent, newBook);

            // Alert
            console.log("submitted");
            UI.showAlert(`Successfully updated ${bookTitle}`, "success");

            // Remove listerner: so it won't run again for future modal form submits
            updateForm.removeEventListener("submit", submitForm);
        }
    }

    updateForm.addEventListener("submit", submitForm);

    // To also remove listener when modal is closed without submit
    const modal = document.querySelector(".modal");
    modal.addEventListener("hidden.bs.modal", () => updateForm.removeEventListener("submit", submitForm));
})