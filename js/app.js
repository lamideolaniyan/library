/**
  DATA CONTROLLER  
 */

const modelController = (function () {
  class Book {
    constructor(title, author, pages, status) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.status = status;
      this.id = booksArray.length === 0 ? 0 : booksArray[booksArray.length - 1].id + 1;
    }
  }

  const booksArray = [];

  return {
    createBook(title, author, pages, status) {
      if (title && author && pages && status) {
        booksArray.push(new Book(title, author, pages, status));
      }
    },

    getBookArray() {
      return booksArray;
    },

    persistData() {
      localStorage.setItem('books', JSON.stringify(booksArray));
    },

    getData() {
      const storage = JSON.parse(localStorage.getItem('books'));

      // If there's data in the local storage, spread(...) and push the array into books array
      if (storage) booksArray.push(...storage);
    },
  };
})();

/**
  DISPLAY CONTROLLER  
 */

const viewController = (function () {
  dom = {
    formInput: document.querySelectorAll('.form__input'),
    formRadio: document.querySelectorAll('.form__radio-input'),
    titleInput: document.querySelector('#title'),
    authorInput: document.querySelector('#author'),
    pagesInput: document.querySelector('#pages'),
    addBtn: document.querySelector('.add-btn'),
    form: document.querySelector('.form'),
    submitBtn: document.querySelector('.btn'),
    popup: document.querySelector('.popup'),
    popupContent: document.querySelector('.popup__content'),
    popupClose: document.querySelector('.popup__close'),
    book: document.querySelector('.book'),
    deleteBtn: document.querySelector('.book__icon--trash'),
    statusBtn: document.querySelector('.status-btn'),
  };

  return {
    dom,

    readInput() {
      let title, author, pages, status;

      title = dom.titleInput.value;
      author = dom.authorInput.value;
      pages = dom.pagesInput.value;
      try {
        status = document.querySelector('input[type=radio]:checked').value;
      } catch (error) {
        alert('Select an Option(Read/Not Read)');
      }
      return { title, author, pages, status };
    },

    displayPopup() {
      dom.popup.style.opacity = '1';
      dom.popup.style.visibility = 'visible';
      dom.popupContent.style.opacity = '1';
    },

    clearPopup() {
      dom.popup.style.opacity = '0';
      dom.popup.style.visibility = 'hidden';
      dom.popupContent.style.opacity = '0';
    },

    clearInput() {
      Array.from(dom.formInput).forEach((el) => {
        el.value = '';
      });

      // Uncheck radio buttons
      Array.from(dom.formRadio).forEach((el) => {
        el.checked = false;
      });
    },

    renderBook(bookArray) {
      let title, author, pages, status, html, newHtml;

      bookArray.forEach((bookObj) => {
        title = bookObj.title;
        author = bookObj.author;
        pages = bookObj.pages;
        status = bookObj.status;
        id = bookObj.id;

        html = `  <ul class="book__list" data-id="%ID%">
                    <li class="book__item--title">
                      <svg class="book__icon book__icon--quill">
                        <use xlink:href="img/symbol-defs.svg#icon-quill"></use>
                      </svg>
                      <span>%TITLE%</span>
                    </li>
                    <li class="book__item--author">%AUTHOR%</li>
                    <li class="book__item--pages">%PAGES%</li>
                    <li class="book__item--status">
                      <span class="status-btn">%STATUS%</span>
                      <a href="#" class="delete__btn">
                        <svg class="book__icon book__icon--trash">
                          <use xlink:href="img/symbol-defs.svg#icon-trash"></use>
                        </svg>
                      </a>
                    </li>
                  </ul>
                `;
        // Replace placeholders with data
        newHtml = html.replace('%TITLE%', title);
        newHtml = newHtml.replace('%AUTHOR%', author);
        newHtml = newHtml.replace('%PAGES%', pages);
        newHtml = newHtml.replace('%STATUS%', status);
        newHtml = newHtml.replace('%ID%', id);

        // Display data
        dom.book.insertAdjacentHTML('beforeend', newHtml);
      });
    },
  };
})();

/**
  OVERALL APP CONTROLLER  
 */
const appController = (function (modelCtrl, viewCtrl) {
  let userInput, title, author, pages, status;
  const dom = viewCtrl.dom;
  const booksArray = modelCtrl.getBookArray();

  // Set up event listener to display form
  dom.addBtn.addEventListener('click', () => {
    viewCtrl.displayPopup();
  });

  // Set up event listener for form submit
  dom.form.addEventListener('submit', (e) => {
    // Prevent form from submitting and altering the url
    e.preventDefault();

    // Get user input and store in variables
    userInput = viewCtrl.readInput();
    title = userInput.title;
    author = userInput.author;
    pages = userInput.pages;
    status = userInput.status;

    // Create new book object and store in book array
    modelCtrl.createBook(title, author, pages, status);

    // Clear input fields and  Close form popup
    if (title && author && pages && status) {
      viewCtrl.clearInput();
      viewCtrl.clearPopup();
    }

    // Clear book div
    dom.book.innerHTML = '';

    // Render book
    viewCtrl.renderBook(booksArray);

    // if (status === 'Read') {
    //   console.log('green');
    //   dom.book.closest('.status-btn').style.color = 'green';
    // }

    // Persist books array in local storage
    modelCtrl.persistData();
  });

  // Set up event listener for form close button
  dom.popupClose.addEventListener('click', () => {
    // Clear input fields
    viewCtrl.clearInput();

    //Close form popup
    viewCtrl.clearPopup();
  });

  // Set up event listener for delete button and to toggle read status
  dom.book.addEventListener('click', (e) => {
    // Check if target is delete btn
    if (e.target.matches('.delete__btn, .delete__btn *')) {
      // Get ID of clicked book
      const id = parseInt(e.target.closest('.book__list').dataset.id);

      // Delete book from array
      booksArray.forEach((book, ind) => {
        if (book.id === id) {
          booksArray.splice(ind, 1);
        }
      });

      // Clear book div
      dom.book.innerHTML = '';

      // Render updated book list
      viewCtrl.renderBook(booksArray);

      // Persist books array in local storage
      modelCtrl.persistData();
    }

    // Check if target is status btn
    if (e.target.matches('.status-btn')) {
      if (e.target.textContent === 'Read') {
        e.target.textContent = 'Unread';
      } else {
        e.target.textContent = 'Read';
      }
    }
  });

  // Set up event listener for page load
  window.addEventListener('load', () => {
    // Get data from local storage
    modelCtrl.getData();

    // Clear book div
    dom.book.innerHTML = '';

    // Render updated book list
    viewCtrl.renderBook(booksArray);
  });
})(modelController, viewController);
