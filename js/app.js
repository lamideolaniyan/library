const modelController = (function () {
  const Book = function (title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  };

  const booksArray = [];

  return {
    createBook(title, author, pages, status) {
      if (title && author && pages && status) {
        booksArray.push(new Book(title, author, pages, status));
      }
    },
    testing() {
      return booksArray;
    },
  };
})();

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

      Array.from(dom.formRadio).forEach((el) => {
        el.checked = false;
      });
    },
  };
})();

const appController = (function (modelCtrl, viewCtrl) {
  let userInput, title, author, pages, status;
  const dom = viewCtrl.dom;

  dom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    userInput = viewCtrl.readInput();
    title = userInput.title;
    author = userInput.author;
    pages = userInput.pages;
    status = userInput.status;

    modelCtrl.createBook(title, author, pages, status);

    if (title && author && pages && status) {
      viewCtrl.clearInput();
      viewCtrl.clearPopup();
    }
  });

  dom.addBtn.addEventListener('click', () => {
    viewCtrl.displayPopup();
  });

  dom.popupClose.addEventListener('click', () => {
    viewCtrl.clearInput();
    viewCtrl.clearPopup();
  });
})(modelController, viewController);
