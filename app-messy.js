// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        // const StoredBooks = [
        //     {
        //         title: "Book One",
        //         author: "John Doe",
        //         isbn: 3434434
        //     },
        //     {
        //         title: "Book Two",
        //         author: "Jane Doe",
        //         isbn: 45545
        //     }
        // ]

        const books = Store.getBooks();
        console.log(books);

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const List = document.querySelector("#book-list");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="d-flex justify-content-center gap-3">
                <button type="button" class="btn update" 
                    data-bs-toggle="modal" data-bs-target="#updateModal" data-bs-edit="${book.title}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>          
                <a class="btn btn-danger btn-sm delete" href="#">X</a>
            </td>
        `;

        List.appendChild(row);
    }

    // static updateBook(el) {
    //     const updateBookForm = document.querySelector("#book-update-form");
    //     updateBookForm.addEventListener("submit", e => {
    //         e.preventDefault();
    //         console.log("submit");

    //         const updatedTitle = document.querySelector("#title-update").value;
    //         const updatedAuthor = document.querySelector("#author-update").value;
    //         const updatedIsbn = document.querySelector("#isbn-update").value;

    //         if (updatedTitle === "" || updatedAuthor === "" || updatedIsbn === "") {
    //             UI.showAlert("Modal: Please fill in all the fields", "danger");
    //         } else {
    //             const row = document.createElement("tr");
    //             row.innerHTML = `
    //                 <td>${updatedTitle}</td>
    //                 <td>${updatedAuthor}</td>
    //                 <td>${updatedIsbn}</td>
    //                 <td class="d-flex justify-content-center gap-3">
    //                     <button type="button" class="btn btn-warning update" data-bs-toggle="modal" data-bs-target="#updateModal">
    //                         Edit
    //                     </button>          
    //                     <a class="btn btn-danger btn-sm delete" href="#">X</a>
    //                 </td>
    //             `;

    //             // console.log(el.parentElement.parentElement);
    //             let oldElement = el.parentElement.parentElement;
    //             oldElement.replaceWith(row);

    //             UI.showAlert("Modal: Book updated", "success");

    //             // e.stopPropagation();
    //         }
    //     })
    // }

    static deleteBook(el) {
        el.parentElement.parentElement.remove();
    }

    static showAlert(message, className) {
        // Make div
        const div = document.createElement("div");
        div.className = `container alert alert-${className}`;
        div.innerText = message;                    // innerText||textContent vs createTextNode ==> overwrite vs additive

        // Add div to DOM
        const form = document.querySelector("#book-form");
        form.insertAdjacentElement("beforebegin", div);

        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// Store Class: Handles Storage - localStorage has key and value
// note: cannot store objects in local storage, therefore need to be strings
// intoStorage: JSON.stringify | fromStorage: JSON.parse
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));  // getItem in string form, then parse to object
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
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks())

// Event: Add a Book
const form = document.querySelector("#book-form");
form.addEventListener("submit", submitNewBook);

function submitNewBook(e) {
    e.preventDefault();

    // Get input value
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validation
    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Please fill all fields", "danger");
    } else {
        const book = new Book(title, author, isbn);

        UI.addBookToList(book);     // added to UI
        Store.addBook(book);        // added to localStorage

        UI.showAlert("Successfully added new book", "success");

        UI.clearFields();
    }
}

// Event: Remove a Book - since there is multiple delete btn, use event propogation ie. select parent of element to be deleted
const bookList = document.querySelector("#book-list");
bookList.addEventListener("click", e => {
    // console.log(e.target);
    if (e.target.classList.contains("delete")) {
        UI.deleteBook(e.target);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);    // to target the isbn

        UI.showAlert("Book removed", "success");
        // } else if (e.target.classList.contains("update")) {         // Event: Update / edit a Book
        // console.log(e.target);
        // UI.updateBook(e.target);
        // ----- or -----
        // document.querySelector("#book-update-form").addEventListener("submit", ev => {
        //     ev.preventDefault();
        //     console.log("submit");

        //     UI.deleteBook(e.target);

        //     let updatedTitle = document.querySelector("#title-update").value;
        //     let updatedAuthor = document.querySelector("#author-update").value;
        //     let updatedIsbn = document.querySelector("#isbn-update").value;

        //     let updatedBook = new Book(updatedTitle, updatedAuthor, updatedIsbn);
        //     UI.addBookToList(updatedBook);
        // })          // same with UI.updateBook except here uses UI.deleteBook|UI.addBookToList whereas top uses the replaceWith method
    }
})

// -------- Speacial request Fahmin - Event: Update ---------------------
// refer to bootstraps' varying modal content

const updateModal = document.querySelector("#updateModal");
updateModal.addEventListener("show.bs.modal", e => {
    let editBtn = e.relatedTarget;
    console.log("editBtn clicked");
    // console.log(editBtn);

    let bookTitle = editBtn.getAttribute("data-bs-edit") && editBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    let bookAuthor = editBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
    let bookIsbn = editBtn.parentElement.previousElementSibling.textContent;
    // console.log(editBtn.parentElement.previousElementSibling.previousElementSibling);
    // console.log(editBtn);
    // console.log(bookTitle);

    const modalLabel = updateModal.querySelector("#updateModalLabel");
    const modalTitleInput = updateModal.querySelector("#title-update");
    const modalAuthorInput = updateModal.querySelector("#author-update");
    const modalIsbnInput = updateModal.querySelector("#isbn-update");

    modalLabel.innerHTML = `Edit <strong>${bookTitle}</strong>`;
    modalTitleInput.value = bookTitle;
    modalAuthorInput.value = bookAuthor;
    modalIsbnInput.value = bookIsbn;

    const updateForm = document.querySelector("#book-update-form");
    updateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        UI.deleteBook(editBtn);

        const book = new Book(modalTitleInput.value, modalAuthorInput.value, modalIsbnInput.value);

        UI.addBookToList(book);

        console.log("submitted");
        UI.showAlert(`${bookTitle} has been updated`, "success");

        updateForm.removeEventListener("submit", arguments.callee);
    })
})