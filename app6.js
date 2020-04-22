class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI class
class Ui {
  addBook(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    //add a row of the book
    row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td><a href="#" class="delete">X<a></td>`;
    //Append the row to the list
    list.appendChild(row);
  }
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  showMessage(msg, className) {
    //create a div
    const div = document.createElement("div");
    //Add a class to give either error or success
    div.className = `alert ${className}`;
    div.innerText = msg;
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    // Insert alert
    container.insertBefore(div, form);
    //time for 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  deleteItem(t) {
    if (t.className === "delete") {
      t.parentElement.parentElement.remove();
    }
  }
}

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
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const ui = new Ui();
      ui.addBook(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    let books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
      localStorage.setItem("books", JSON.stringify(books));
    });
  }
}

//Event Listeners
document.addEventListener("DOMContentLoaded", Store.displayBooks);
document.getElementById("book-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;
  //Instantiate a book
  const book = new Book(title, author, isbn);
  //Instantiate the UI
  const ui = new Ui();
  //Validate the fields
  if (title === "" || author === "" || isbn === "") {
    //Error alert
    ui.showMessage("Please, fill the fields", "error");
  } else {
    ui.addBook(book);
    Store.addBook(book);
    ui.clearFields();
    //Success message
    ui.showMessage("Book Added successfully!", "success");
  }

  e.preventDefault();
});

document.querySelector("#book-list").addEventListener("click", function (e) {
  const ui = new Ui();
  ui.deleteItem(e.target);
  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showMessage("Book Removed!", "success");
  e.preventDefault();
});
