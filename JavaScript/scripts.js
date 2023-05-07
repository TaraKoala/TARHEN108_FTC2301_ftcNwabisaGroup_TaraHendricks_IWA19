//import data from the data.js file, be sure to have the variables declared and exported
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


const matches = books
let page = 1;
const range = [0, BOOKS_PER_PAGE];

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

//themes for the app
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

//fragment created to hold books
let fragment = document.createDocumentFragment()
const extracted = books.slice(0, 36)

//create query selectors to select HTML elements to be used in the file

const searchButton = document.querySelector("[data-header-search]");
const cancelSearch = document.querySelector("[data-search-cancel]");
const settingsButton = document.querySelector("[data-header-settings]");
const settingsCancel = document.querySelector("[data-settings-cancel]");
const dataListItems = document.querySelector("[data-list-items]");
const moreButton = document.querySelector("[data-list-button]");
const themeSettings = document.querySelector('[data-settings-theme]')
const saveSettings = document.querySelector("[data-settings-form]");
const themeChoice = document.querySelector("[data-settings-theme]");
const searchGenres = document.querySelector("[data-search-genres]");
const authorsOptions = document.querySelector("[data-search-authors]");

// for (let i = 0; i < BOOKS_PER_PAGE; i++) {
//     const book = books[index];
    
// }

for (const book of extracted) {
    const { author: authorId, id, image, title } = book;
  
    let preview = document.createElement("button");
          preview.classList = 'preview'
          preview.setAttribute('data-preview', id)
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
  
    fragment.appendChild(preview);
  }

dataListItems.appendChild(fragment)

searchButton.addEventListener("click", (event) => {
    document.querySelector("[data-search-overlay]").showModal();
    document.querySelector("[data-search-title]").focus();
//   data - search - title.focus();
}); 

cancelSearch.addEventListener("click", (event) => {
  document.querySelector("[data-search-overlay]").close();
});

settingsButton.addEventListener('click', (event) => {
    document.querySelector("[data-settings-overlay]").showModal();
})

settingsCancel.addEventListener('click', () => {
    document.querySelector("[data-settings-overlay]").close();
})

moreButton.innerHTML = /* html */
    `<span>Show more</span>
    <span class="list__remaining">${
      matches.length - [page * BOOKS_PER_PAGE] > 0
        ? matches.length - [page * BOOKS_PER_PAGE]
        : 0
}</span>`;
      
const createPreviewsFragment = (matches, start = (page * BOOKS_PER_PAGE), end = (page + 1) * BOOKS_PER_PAGE) => {
    let extracted = matches.slice(start, end);
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

      fragment.appendChild(preview);
    }
    return fragment
};


moreButton.addEventListener('click', () => {
    dataListItems.appendChild(createPreviewsFragment(matches))
    moreButton.textContent = `Show more (${books.length - (BOOKS_PER_PAGE * page)})`;
    if (matches.length - page * BOOKS_PER_PAGE <= 0) {
        moreButton.disabled = true;
        moreButton.textContent = `Show more (0)`;
    } else {moreButton.disabled = false;}
}) 

themeSettings.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

console.log(themeChoice.value)

saveSettings.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(themeChoice.value)
    if (themeChoice.value === 'day') {
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
        document.documentElement.style.setProperty("--color-light", "255, 255, 255");
    } else if (themeChoice.value === "night") {
        document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
        document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    }
    document.querySelector("[data-settings-overlay]").close();
})

const genresList = document.createDocumentFragment()
let elementGenre = 'All Genres'
searchGenres.innerHTML = `<option>${elementGenre}</option>`

searchGenres.appendChild(genresList);

for (let [genreID, genreName] of Object.entries(genres)) {
    let genreOption = document.createElement("option");
    genreOption.innerText = `${genreName}`
    // document.createElement('option')
    genreOption.value = genreID
    // element.innerText = text
    genresList.appendChild(genreOption)
}
searchGenres.appendChild(genresList);

const authorList = document.createDocumentFragment()
let elementAuthors = 'All Authors'
authorsOptions.innerHTML = `<option>${elementAuthors}</option>`;

for (let [id, name] of Object.entries(authors)) {
    let authorOption = document.createElement('option')
    authorOption.innerText = `${name}`
    authorOption.value = id
    authorList.appendChild(authorOption)
}

authorsOptions.appendChild(authorList)