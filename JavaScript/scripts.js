//import data from the data.js file, be sure to have the variables declared and exported
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

//Global variables which would be used throughout the script
let matches = books;
let page = 1;
const range = [0, BOOKS_PER_PAGE];

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

//object created for themes in order for the app to toggle between light and dark
const themeColor = {
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
let extracted = books.slice(0, BOOKS_PER_PAGE)

// shows the first 36 books on the page
//I made use of the function and DOM to pull elements from the HTML doc, this enables the user to preview the list of books.
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

//loop for the preview of books
for (const books of extracted) {
    const preview = createPreview(books)
    fragment.appendChild(preview)
}

document.querySelector("[data-list-items]").appendChild(fragment);

//show more button that loads more books onto the app/web browser
//to use the show more button, I used a query selector with a function, as well as ternary statements, as not to make the code too loaded. I added the event listener function, on a show more button, so that when the user clicks it, it loads another 36 books. 
const showmoreButton = document.querySelector('[data-list-button]')

const updateRemaining = () => {
    const remaining = books.length - (BOOKS_PER_PAGE * page)
    return remaining;
}

const showMore = (event) => {
    event.preventDefault()
    page += 1
    const remaining = updateRemaining()
    const hasRemaining = remaining > 0 ? remaining : 0

    const rangeStart = (page - 1) * BOOKS_PER_PAGE
    const rangeEnd = books.length - remaining
    extracted = books.slice(rangeStart, rangeEnd)

    if (hasRemaining > 0) {
        for (const books of extracted) {
            const preview = createPreview(books)
            fragment.appendChild(preview)
        }
        
        document.querySelector("[data-list-items]").appendChild(fragment);

        const previewList = document.querySelectorAll('.preview')
        const previewArray = Array.from(previewList)
        for (const preview of previewArray) {
            preview.addEventListener('click', activePreview)
        }
    }
};

showmoreButton.addEventListener("click", showMore) 

showmoreButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining">
        (${updateRemaining()})
    </span>
`;

//summary of books on page
//to make the summary of each book appear when clicked on, I used query selectors for each relevant html element, then used a function for an event, targeting the closest element, so that when it is clicked, the overlay shows up. The showModal function is used to make the overlay visible and I included a for loop to check through the array of books for id's that matches and if so, displays that book preview. I made use of interpilation on line 133, with a built-in object to get the year in which the book was published.
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

//elements in the overlay that displays genre and author in the search button
//For the search button, the overlay needed to display genre and author options, to achieve this, multiple elements needed to be appended to the DOM, the for loop is used to generate a drop down menu of options.
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

//search toggle opens the search options
//to make the search options overlay appear when clicked on, I used query selectors for each relevant html element. I then used a function with an event and used prevent default to ensure that the page doesn't change back when clicked. I then used the showModal function to display the overlay and an eventlistener to show the overlay when the search button is clicked.
const searchButton = document.querySelector('[data-header-search]')
const searchMenu = document.querySelector('[data-search-overlay]')
const searchCancel = document.querySelector('[data-search-cancel]')

const showSearchMenu = (event) => {
    event.preventDefault()
    searchMenu.showModal()

    searchCancel.addEventListener('click', () => {
        searchMenu.close()
    })
}

searchButton.addEventListener('click', showSearchMenu)

//settings for theme toggle button
//to create the setting for the theme preference of the user, a query selector is used with a MediaQueryList object, containing information on whether the user wants the them set to light or dark. I then added the event function with the showModal function and an eventListener, that when clicked, displays the overlay of the settings.
document.querySelector('[data-settings-theme]').value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'day' : 'night'
let v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'day' : 'night'

//CSS properties used in the DOM to set the theme colours
document.documentElement.style.setProperty('--color-dark', themeColor[v].dark);
document.documentElement.style.setProperty('--color-light', themeColor[v].light);

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


const settingsSave = document.querySelector('[data-settings-overlay] [type="submit"]')
const settingsData = document.querySelector('[data-settings-form]')


//to ensure the theme is saved, an event fucntion is used along with an object set to formData.
const saveTheme = (event) => { 
    event.preventDefault()
    const formData = new FormData(settingsData)
    const result = Object.fromEntries(formData)

    document.documentElement.style.setProperty('--color-dark', themeColor[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', themeColor[result.theme].light);
    
    settings.close()
}

settingsSave.addEventListener('click', saveTheme)