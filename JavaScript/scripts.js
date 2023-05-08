//import data from the data.js file, be sure to have the variables declared and exported
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


const matches = books
let page = 1;
const range = [0, BOOKS_PER_PAGE];

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

//themes for the app
const themeColors = {
    night : {
        dark: '255, 255, 255',
        light: '10, 10, 20'
    },
    day : {
        dark: '10, 10, 20',
        light: '255, 255, 255'
    }
}

//fragment created to hold books
const fragment = document.createDocumentFragment()
const extracted = books.slice(0, BOOKS_PER_PAGE)

// shows books on the page
const createPreview = (props) => {
    const {author, id, image, title} = props

    const element = document.createElement("button");
    element.classList.add("preview");
    element.dataset.preview = id;
    element.innerHTML = /* html */ `
    <img 
        class="preview__image" 
        src="${image}" 
    />
    
    <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
    </div>
    `;

    return element
};

for (const booksIndex of extracted) {
    const preview = createPreview(booksIndex)
    fragment.appendChild(preview)
}

document.querySelector("[data-list-items]").appendChild(fragment);

//show more button 
const moreButton = document.querySelector("[data-list-button]");

moreButton.innerHTML = /* html */
    `<span>Show more</span>
    <span class="list__remaining">${
      matches.length - [page * BOOKS_PER_PAGE] > 0
        ? matches.length - [page * BOOKS_PER_PAGE]
        : 0
}</span>`;

const showMoreFragment = (matches, start = (page * BOOKS_PER_PAGE), end = (page + 1) * BOOKS_PER_PAGE) => {
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
    dataListItems.appendChild(showMoreFragment(matches))
    moreButton.textContent = `Show more (${books.length - (BOOKS_PER_PAGE * page)})`;
    if (matches.length - page * BOOKS_PER_PAGE <= 0) {
        moreButton.disabled = true;
        moreButton.textContent = `Show more (0)`;
    } else {moreButton.disabled = false;}
}) 

//edit from around here


//search button
const searchButton = document.querySelector('[data-search-overlay] [type="submit"]')
const searchData = document.querySelector('[data-search-form]')

const filter = (event) => { 
    event.preventDefault()
    const formData = new FormData(searchData)
    const filters = Object.fromEntries(formData)
    console.log(filters);
    const result = []

    for (const book of books) {
        const titleMatch = filters.title.trim() && book.title.toLowerCase().includes(filters.title.toLowerCase())
        let authorMatch = true
        let genreMatch = true

        if (filters.author !== 'any') {
            authorMatch = books.author === filters.author
        }

        if (filters.genre !== 'any') {
            for (const singleGenre of book.genres) {
                genreMatch = singleGenre === filters.genre
            }
        }

        console.log(`
        titleMatch ${titleMatch}
        authorMatch ${authorMatch}
        genreMatch ${genreMatch}
        `);
    }

    optionsMenu.close()
}

searchButton.addEventListener('click', filter)

//options button
const optionsButton = document.querySelector('[data-header-search]')
const optionsMenu = document.querySelector('[data-search-overlay]')
const optionsCancel = document.querySelector('[data-search-cancel]')

const showOptionsMenu = (event) => {
    event.preventDefault()
    optionsMenu.showModal()

    optionsCancel.addEventListener('click', () => {
        optionsMenu.close()
    })
}

optionsButton.addEventListener('click', showOptionsMenu)
const settingsSave = document.querySelector('[data-settings-overlay] [type="submit"]')
const settingsData = document.querySelector('[data-settings-form]')

const saveTheme = (event) => { 
    event.preventDefault()
    const formData = new FormData(settingsData)
    const result = Object.fromEntries(formData)

    document.documentElement.style.setProperty('--color-dark', themeColors[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', themeColors[result.theme].light);
    
    settings.close()
}

settingsSave.addEventListener('click', saveTheme)


//view summary of books
const summary = document.querySelector('[data-list-active]')
const summaryClose = document.querySelector('[data-list-close]')
const summaryBackground = document.querySelector('[data-list-blur]')
const summaryImage = document.querySelector('[data-list-image]')
const summaryTitle = document.querySelector('[data-list-title]')
const summarySubtitle = document.querySelector('[data-list-subtitle]')
const summaryDescription = document.querySelector('[data-list-description]')

const activePreview = (event) => {
    event.preventDefault()
    let active

    const bookPreview = event.target.closest('.preview')
    const bookPreviewId = bookPreview.getAttribute('data-preview');
    
    for (const book of books) {
        if (active) break

        if (book.id === bookPreviewId) {
            active = book
        }
    }

    if (!active) return

    const { title, image, description, published, author } = active
    summary.showModal()
    summaryBackground.src = image
    summaryImage.src = image
    summaryTitle.innerText = title
    summarySubtitle.innerText = `${authors[author]} (${new Date(published).getFullYear()})`
    summaryDescription.innerText = description
    
    summaryClose.addEventListener('click', () => {
        summary.close()
    })
}
2

const previewList = document.querySelectorAll('.preview')
const previewArray = Array.from(previewList)
for (const preview of previewArray) {
    preview.addEventListener('click', activePreview)
}