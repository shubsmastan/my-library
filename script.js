// Grabbing important DOM elements
const bookLibrary = document.querySelector(".book-library");
const addBook = document.getElementById("add-book");
const bookForm = document.getElementById("book-form");
const modal1 = document.getElementById("delete-modal");
const modal2 = document.getElementById("edit-modal");
const login = document.getElementById("login");

// Book constructor function
function book(title, author, pages, read) {
  return { title, author, pages, read };
}

// Set up library and get from local storage (if any)
myLibrary = [];

let lib = JSON.parse(localStorage.getItem("myLibrary"));
if (lib) {
  for (let i = 0; i < lib.length; i++) {
    myLibrary.push(lib[i]);
  }
}

// Add the books in array to book library in DOM
function renderBooks() {
  for (let i = 0; i < myLibrary.length; i++) {
    addBookToLibrary(myLibrary[i], i);
  }
}

renderBooks();

// Open the add new book form
addBook.onclick = function () {
  bookForm.style.display = "flex";
  document.getElementById("title").focus();

  const deleteBtn = document.getElementById("form-delete-btn");
  deleteBtn.onclick = function () {
    bookForm.style.display = "none";
  };

  const readBtn = document.getElementById("form-read-btn");
  readBtn.onclick = function () {
    if (readBtn.classList.contains("not-read")) {
      readBtn.classList.remove("not-read");
      readBtn.classList.add("read");
    } else {
      readBtn.classList.remove("read");
      readBtn.classList.add("not-read");
    }
  };

  const tickBtn = document.getElementById("form-tick-btn");
  tickBtn.onclick = function (e) {
    e.preventDefault();
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const pages = document.getElementById("pages");
    const readBtn = document.getElementById("form-read-btn");

    if (title.value == "" || author.value == "" || pages.value == "") {
      alert("Complete all fields.");
      title.focus();
      return;
    }

    const newBook = book(title.value, author.value, pages.value, false);
    if (readBtn.classList.contains("read")) newBook.read = true;
    bookForm.style.display = "none";
    addBookToLibrary(newBook, myLibrary.length);
    myLibrary.push(newBook);
    saveLibrary();

    bookForm.reset();
    readBtn.classList.remove("read");
    readBtn.classList.add("not-read");
  };
};

// Function to add the books into the library
function addBookToLibrary(book, index) {
  const bookCard = createElement("div", "", "book-card");
  bookCard.setAttribute("data-index", index);

  const cardButtons = createElement("div", "", "card-buttons");

  const editBtn = createElement("button", "✐", "edit");
  editBtn.onclick = function () {
    editModal(bookCard);
  };
  cardButtons.appendChild(editBtn);

  const deleteBtn = createElement("button", "×", "delete");
  deleteBtn.onclick = function () {
    deleteModal(bookCard);
  };
  cardButtons.appendChild(deleteBtn);

  bookCard.appendChild(cardButtons);

  const bookDetails = createElement("div", "", "book-details");

  bookDetails.appendChild(createElement("p", book.title, "title"));
  bookDetails.appendChild(createElement("p", book.author, "author"));
  bookDetails.appendChild(createElement("p", book.pages, "pages"));
  const readBtn = createElement("button", "", "read-toggle");
  readBtn.setAttribute("type", "button");
  if (book.read === true) {
    readBtn.classList.add("read");
  } else {
    readBtn.classList.add("not-read");
  }
  bookDetails.appendChild(readBtn);

  bookCard.appendChild(bookDetails);

  bookLibrary.prepend(bookCard);
}

// Function to edit book by opening modal
function editModal(card) {
  modal2.style.display = "block";

  const index = card.getAttribute("data-index");
  const book = myLibrary[index];

  const confirmBtn = modal2.querySelector(".confirm");
  confirmBtn.onclick = function (e) {
    e.preventDefault();
    if (
      inputs[0].value == "" ||
      inputs[1].value == "" ||
      inputs[2].value == ""
    ) {
      alert("Complete all fields.");
      title.focus();
      return;
    }

    book.title = inputs[0].value;
    card.querySelector(".title").textContent = book.title;
    book.author = inputs[1].value;
    card.querySelector(".author").textContent = book.author;
    book.pages = inputs[2].value;
    card.querySelector(".pages").textContent = book.pages;

    if (readBtn.classList.contains("read")) {
      book.read = true;
      card.querySelector(".read-toggle").classList.add("read");
      card.querySelector(".read-toggle").classList.remove("not-read");
    } else {
      book.read = false;
      card.querySelector(".read-toggle").classList.remove("read");
      card.querySelector(".read-toggle").classList.add("not-read");
    }

    saveLibrary();
    modal2.style.display = "none";
  };

  const bookDetails = modal2.querySelector(".book-details");
  const inputs = modal2.getElementsByTagName("input");
  const readBtn = document.getElementById("e-form-read-btn");
  inputs[0].value = book.title;
  inputs[1].value = book.author;
  inputs[2].value = book.pages;
  if (book.read) {
    readBtn.classList.remove("not-read");
    readBtn.classList.add("read");
  }

  readBtn.onclick = function () {
    if (readBtn.classList.contains("not-read")) {
      readBtn.classList.remove("not-read");
      readBtn.classList.add("read");
      book.read = true;
    } else {
      readBtn.classList.remove("read");
      readBtn.classList.add("not-read");
      book.read = false;
    }
  };

  cancelBtn = document.getElementById("edit-delete-btn");
  cancelBtn.onclick = function () {
    modal2.style.display = "none";
  };
}

// Function to delete book by opening modal
function deleteModal(card) {
  modal1.style.display = "block";

  const confirmDelete = document.getElementById("confirm-delete");
  confirmDelete.onclick = function () {
    const index = card.getAttribute("data-index");
    myLibrary.splice(index, 1);
    let prevCard = card.previousSibling;

    // Adjusts data-index value for all cards above deleted one
    for (let i = index; i < myLibrary.length; i++) {
      prevCard.setAttribute("data-index", i);
      prevCard = prevCard.previousSibling;
    }

    card.remove();
    saveLibrary();
    modal1.style.display = "none";
  };

  const closeModal = document.getElementById("close-modal");
  closeModal.onclick = function () {
    modal1.style.display = "none";
  };
}

// Helper function to create HTML elements with given text and class
function createElement(type, text, className) {
  const element = document.createElement(type);
  element.textContent = text;
  element.setAttribute("class", className);
  return element;
}

// Save library in local storage
function saveLibrary() {
  const myLibJSON = JSON.stringify(myLibrary);
  localStorage.setItem("myLibrary", myLibJSON);
}

// Log in button not in use at present - used as a test to check status of library array
login.onclick = function () {
  console.log(myLibrary);
};
