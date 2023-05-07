import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

const FRAGMENT = document.createDocumentFragment();

// page initialized for use in the createPreviewsFragment() function
let page = 0;

/**
 * object containing all HTML elements necessary for selection and manipulation
 */
export const selectors = {
  searchButton: document.querySelector("[data-header-search]"),
  cancelSearch: document.querySelector("[data-search-cancel]"),
  settingsButton: document.querySelector("[data-header-settings]"),
  settingsCancel: document.querySelector("[data-settings-cancel]"),
  settingsForm: document.querySelector("[data-settings-overlay]"),
  saveSettings: document.querySelector("[data-settings-form]"),
  dataListItems: document.querySelector("[data-list-items]"),
  moreButton: document.querySelector("[data-list-button]"),
  themeSettings: document.querySelector("[data-settings-theme]"),
  themeChoice: document.querySelector("[data-settings-theme]"),
  searchGenres: document.querySelector("[data-search-genres]"),
  authorsOptions: document.querySelector("[data-search-authors]"),
  searchForm: document.querySelector("[data-search-form]"),
  singleBook: document.querySelectorAll(".preview"),
  bookPreview: document.querySelector("[data-list-active]"),
  bookPreviewClose: document.querySelector("[data-list-close]"),
  bookPreviewImage: document.querySelector("[data-list-image]"),
  bookPreviewTitle: document.querySelector("[data-list-title]"),
  bookPreviewSubtitle: document.querySelector("[data-list-subtitle]"),
  bookPreviewDescription: document.querySelector("[data-list-description]"),
  bookPreviewBlur: document.querySelector("[data-list-blur]"),
  beginSearch: document.querySelector('[form="search"]'),
  searchMenu: document.querySelector("[data-search-overlay]"),
  searchTitle: document.querySelector("[data-search-title"),
  noResultsMessage: document.querySelector("[data-list-message]"),
};

// Object for theme color values used in themeUpdate() function
const day = {
  dark: "10, 10, 20",
  light: "255, 255, 255",
};

// Object for theme color values used in themeUpdate() function
const night = {
  dark: "255, 255, 255",
  light: "10, 10, 20",
};

/**
 * This function is used by event listeners, when called, it will check if the bookPreview dialog tag is open, and if not, it will show it, if the target then becomes the bookPreviewClose button, the dialog tag will close. It also adds image, title, subtitle and description to the HTML for user viewing
 */
export const singleBookPreview = (event) => {
    const { target } = event;
    if (selectors.bookPreview.open === false) {
    selectors.bookPreview.showModal();
  } else if (target === selectors.bookPreviewClose) {
    selectors.bookPreview.close();
    }
    for (let book of books) {
        if (
          target.getAttribute("data-preview") === book.id ||
          target.parentNode.parentNode.getAttribute("data-preview") === book.id ||
          target.parentNode.getAttribute("data-preview") === book.id
        ) {
          selectors.bookPreviewImage.src = book.image;
          selectors.bookPreviewBlur.src = book.image;
          selectors.bookPreviewTitle.textContent = book.title;
          selectors.bookPreviewSubtitle.textContent = `${
            authors[book.author]
          } (${new Date(book.published).getFullYear()})`;
          selectors.bookPreviewDescription.textContent = book.description;
        }
    }
};

/**
 * This function takes an array, a start and an end. It will then extract 36 books depending on where it starts and ends and create a button for each of them. The function then extracts the relevant information using destructuring and adds it the HTML where needed.
 * @type {object} books 
 * @type {number} start 
 * @type {number} end 
 * @returns {html}
 */
export const createPreviewsFragment = (books, start = (page * BOOKS_PER_PAGE), end = (page + 1) * BOOKS_PER_PAGE) => {
    let extracted = books.slice(start, end);
    page += 1
    for (const book of extracted) {
      const { author: authorId, id, image, title } = book;

      let preview = document.createElement("button");
      preview.classList = "preview";
      preview.setAttribute("data-preview", id);
      preview.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div>
        `;

      FRAGMENT.appendChild(preview);
    }
    return FRAGMENT
};

/**
 * This function toggles the theme settings to close and open when added to an event listener 
 */
export const settingsEvents = (event) => {
  const { target } = event;
  if (selectors.settingsForm.open === false) {
    selectors.settingsForm.showModal();
  } else if (target === selectors.settingsCancel) {
    selectors.settingsForm.close();
  }
};

/**
 * This function will update the theme based on user preference and settings.
 */
export const themeUpdate = (event) => {
    event.preventDefault()
    let css = selectors.themeChoice.value;
    if (css === 'day') {
        document.documentElement.style.setProperty("--color-dark", day.dark);
        document.documentElement.style.setProperty("--color-light", day.light);
    } else if (css === "night") {
        document.documentElement.style.setProperty("--color-dark", night.dark);
        document.documentElement.style.setProperty("--color-light", night.light);
    }
    document.querySelector("[data-settings-overlay]").close();
}

/**
 *  This function will create buttons for the next 36 books, add relevant classings to them and then add them to the HTML
 */
export const moreBooks = (event) => {
    selectors.dataListItems.appendChild(createPreviewsFragment(books))
    selectors.singleBook = document.querySelectorAll(".preview");
    for (let button of selectors.singleBook) {
      button.addEventListener("click", singleBookPreview);
    }
    selectors.moreButton.textContent = `Show more (${books.length - (BOOKS_PER_PAGE * page)})`;
    if (books.length - page * BOOKS_PER_PAGE <= 0) {
        selectors.moreButton.disabled = true;
        selectors.moreButton.textContent = `Show more (0)`;
    } else {selectors.moreButton.disabled = false;}
}

/**
 * This code manages the search dialogue, closes and opens when necessary 
 */
export const searchFunctions = (event) => {
  const { target } = event;
  if (selectors.searchMenu.open === false) {
    selectors.searchMenu.showModal();
    document.querySelector("[data-search-title]").focus();
  } else if (target === selectors.cancelSearch) {
    selectors.searchMenu.close();
  }
};

/**
 * This function creates a results array which fills with book objects based on books in the if else statements, once the loop completes, the results are pushed to the webpage
 */
export const createSearchHTML = (event) => {
    event.preventDefault()
    selectors.searchMenu.close();
  selectors.moreButton.disabled = true
  selectors.moreButton.textContent = `Show more (0)`;
    let results = []
    let genre = selectors.searchGenres.value;
    let author = selectors.authorsOptions.value
    for (let book of books) {
      if (book.genres.includes(genre) && book.author === author && selectors.searchTitle.value === "") {
          results.push(book);
      } else if (book.genres.includes(genre) && author === "All Authors" && selectors.searchTitle.value === ""){
          results.push(book);
      } else if (genre === "All Genres" && book.author === author && selectors.searchTitle.value === ""
      ) {
          results.push(book);
      } else if (book.title.toLowerCase().includes(selectors.searchTitle.value.toLowerCase()) && author === "All Authors" && genre === "All Genres") {
          results.push(book)
      } else if (book.title.toLowerCase().includes(selectors.searchTitle.value.toLowerCase()) && book.genres.includes(genre) && book.author === author) {
          results.push(book);
      } else if (book.title.toLowerCase().includes(selectors.searchTitle.value.toLowerCase()) && book.genres.includes(genre) && author === "All Authors") {
          results.push(book);
      } else if (book.title.toLowerCase().includes(selectors.searchTitle.value.toLowerCase()) && genre === "All Genres" && book.author === author) {
          results.push(book);
      } 
  }
    if (results.length === 0) {
      selectors.noResultsMessage.classList.add("list__message_show");
  }
  selectors.dataListItems.replaceChildren(createPreviewsFragment(results, 0, 36));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}