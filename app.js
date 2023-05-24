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
        const StoredBooks = [
            {
                title: "Book One",
                author: "John Doe",
                isbn: 3434434
            },
            {
                title: "Book Two",
                author: "Jane Doe",
                isbn: 45545
            }
        ]

        const books = StoredBooks;

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

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// Store Class: Handles Storage

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

    const book = new Book(title, author, isbn);

    UI.addBookToList(book);

    UI.clearFields();
}

// Event: Remove a Book























/*
Step 1: Book, UI, UI.displayBooks, UI.addBookToList
Step 2: Add a book
*/