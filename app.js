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

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const List = document.querySelector("#book-list");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a class="btn btn-danger btn-sm delete" href="#">X</a></td>
        `;

        List.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        // Make div
        const div = document.createElement("div");
        div.className = `container alert alert-${className}`;
        div.innerText = message;

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

// Store Class: Handles Storage
// note: cannot store objects in local storage, therefore need to be strings
// intoStorage: JSON.stringify | fromStorage: JSON.parse
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
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);    // to target the isbn

    UI.showAlert("Book removed", "success");
})