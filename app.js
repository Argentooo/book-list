class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a class="delete" href="#">X</a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `alert ${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
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

    books.forEach(function (book) {
      const ui = new UI();

      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
    console.log(book);
  }

  static removeBook(book, isbn) {
    const books = Store.getBooks();

    books.forEach(function (index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    console.log(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.getElementById("book-form").addEventListener("submit", (e) => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);

  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Заполните все поля!", "error");
  } else {
    ui.addBookToList(book);

    Store.addBook(book);

    ui.showAlert("Книга добавлена!", "success");

    ui.clearFields();
  }

  e.preventDefault();
});

document.getElementById("book-list").addEventListener("click", (e) => {
  const ui = new UI();

  ui.deleteBook(e.target);

  Store.removeBook(e.target);
  console.log(e.target);

  ui.showAlert("Книга удалена!", "success");

  e.preventDefault();
});

window.addEventListener("load", showBooks);

function showBooks() {
  Store.displayBooks();
}
