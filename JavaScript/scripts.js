//import data from the data.js file, be sure to have the variables declared and exported
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


const matches = books
let page = 1;
const range = [0, BOOKS_PER_PAGE];

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

//themes for the app
const css = {
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

const genresFragment = document.createDocumentFragment()
const genresOption = document.createElement('option')
genresOption.value = 'any'
genresOption.innerText = 'All Genres'
genresFragment.appendChild(genresOption)

for (const genre in genres) {
    const genresOption = document.createElement('option')
    genresOption.value = genres[genre]
    genresOption.innerText = genres[genre]
    genresFragment.appendChild(genresOption)
}

document.querySelector('[data-search-genres]').appendChild(genresFragment)

const authorsFragment = document.createDocumentFragment()
const authorsOption = document.createElement('option')
authorsOption.value = 'any'
authorsOption.innerText = 'All Authors'
authorsFragment.appendChild(authorsOption)

for (const author in authors) {
    const authorsOption = document.createElement('option')
    authorsOption.value = authors[author]
    authorsOption.innerText = authors[author]
    authorsFragment.appendChild(authorsOption)
}

document.querySelector('[data-search-authors]').appendChild(authorsFragment)

document.querySelector('[data-settings-theme]').value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'day' : 'night'
let v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'day' : 'night'

document.documentElement.style.setProperty('--color-dark', css[v].dark);
document.documentElement.style.setProperty('--color-light', css[v].light);

const showmoreButton = document.querySelector('[data-list-button]')

const updateRemaining = () => {
    const remaining = books.length - (BOOKS_PER_PAGE * page)
    return remaining;
}

showmoreButton.innerHTML = /* html */ `
    Show more 
    <span class="list__remaining">
        (${updateRemaining()})
    </span>
`;

const showSettings = (event) => {
    event.preventDefault()
    settings.showModal()

    settingsCancel.addEventListener('click', () => {
        settings.close()
    })
}
const settingsButton = document.querySelector('[data-header-settings]')
const settingsCancel = document.querySelector('[data-settings-cancel]')
const settings = document.querySelector('[data-settings-overlay]')

settingsButton.addEventListener('click', showSettings)

const showMore = (event) => {
    event.preventDefault()
    page += 1
    const remaining = updateRemaining()
    const hasRemaining = remaining > 0 ? remaining : 0

    const rangeStart = (page - 1) * BOOKS_PER_PAGE
    const rangeEnd = books.length - remaining
    extracted = books.slice(rangeStart, rangeEnd)

    if (hasRemaining > 0) {
        for (const booksIndex of extracted) {
            const preview = createPreview(booksIndex)
            fragment.appendChild(preview)
        }
        
        document.querySelector("[data-list-items]").appendChild(fragment);

        const previewList = document.querySelectorAll('.preview')
        const previewArray = Array.from(previewList)
        for (const preview of previewArray) {
            preview.addEventListener('click', activePreview)
        }
    }
    
    showmoreButton.innerHTML = /* html */ `
    <span>Show more </span>
    <span class="list__remaining">
        (${hasRemaining})
    </span>
    `; 
};

showmoreButton.addEventListener("click", showMore) 

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


const settingsSave = document.querySelector('[data-settings-overlay] [type="submit"]')
const settingsData = document.querySelector('[data-settings-form]')

const saveTheme = (event) => { 
    event.preventDefault()
    const formData = new FormData(settingsData)
    const result = Object.fromEntries(formData)

    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    
    settings.close()
}

settingsSave.addEventListener('click', saveTheme)

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


const previewList = document.querySelectorAll('.preview')
const previewArray = Array.from(previewList)
for (const preview of previewArray) {
    preview.addEventListener('click', activePreview)
}