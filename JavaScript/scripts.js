// @ts-check

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { Preview, domElements } from './objects.js';

const previewOutput = new Preview();

const starting = document.createDocumentFragment();

for (const { image, title, id, author } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button');
    //@ts-ignore
    element.classList = 'preview'; //initially returned 'cannot assign to 'classList' because it is a read-only property'; added ts-ignore
    element.setAttribute('data-preview', id);

    element.innerHTML = previewOutput.previewHtml(image, title, authors, author);
    
    starting.appendChild(element)
}
domElements.list.dataListItems.appendChild(starting);


const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
};

domElements.search.dataSearchGenres.appendChild(genreHtml);

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}
domElements.search.dataSearchAuthors.appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    domElements.settings.dataSettingsTheme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    domElements.settings.dataSettingsTheme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

domElements.list.dataListButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`

domElements.list.dataListButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 0;

domElements.list.dataListButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 
        ? (matches.length - (page * BOOKS_PER_PAGE)) 
        : 0})</span>
`

/**
 * Function to close overlay boxes
 * @returns {boolean}
 */
const openFalse = (item) => {
    return item.open = false;
};

/**
 * Function to open overlay boxes
 * @returns {boolean}
 */
const openTrue = (item) => {
    return item.open = true;
};

domElements.search.dataSearchCancel.addEventListener('click', () => {
   openFalse(domElements.search.dataSearchOverlay);
});

domElements.settings.dataSettingsCancel.addEventListener('click', () => {
   openFalse(domElements.settings.dataSettingsOverlay);
});

domElements.header.dataHeaderSearch.addEventListener('click', () => {
    openTrue(domElements.search.dataSearchOverlay); 
    domElements.search.dataSearchTitle.focus();
});

domElements.header.dataHeaderSettings.addEventListener('click', () => {
    openTrue(domElements.settings.dataSettingsOverlay);
});

domElements.list.dataListClose.addEventListener('click', () => {
    openFalse(domElements.list.dataListActive);
}); 

domElements.settings.dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    openFalse(domElements.settings.dataSettingsOverlay);
});

domElements.search.dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    /**
     * @type {HTMLFormElement} 
     */
    //@ts-ignore
    const formData = new FormData(event.target);
    //@ts-ignore
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
        let genreMatch = filters.genre === 'any';

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true };
        };

        if (    
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book);
        };
    };

    page = 1;
    matches = result;

    if (result.length < 1) {
        domElements.list.dataListMessage.classList.add('list__message_show');
    } else {
        domElements.list.dataListMessage.classList.remove('list__message_show');
    };

    domElements.list.dataListItems.innerHTML = '';
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        //@ts-ignore
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = previewOutput.previewHtml(image, title, authors, author);

        newItems.appendChild(element);
    };

    domElements.list.dataListItems.appendChild(newItems);
    
    domElements.list.dataListButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;

    domElements.list.dataListButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `;

    window.scrollTo({top: 0, behavior: 'smooth'});
    openFalse(domElements.search.dataSearchOverlay);
});

domElements.list.dataListButton.addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        //@ts-ignore
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = previewOutput.previewHtml(image, title, authors, author);

        fragment.appendChild(element);
    };

    domElements.list.dataListItems.appendChild(fragment);
    page += 1;
});
domElements.list.dataListItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            let result = null;
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook;
            } 
        
            active = result;
        }
    }
    
    if (active) {
        domElements.list.dataListActive.open = true;
        domElements.list.dataListBlur.src = active.image;
        domElements.list.dataListImage.src = active.image;
        domElements.list.dataListTitle.innerText = active.title;
        domElements.list.dataListSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        domElements.list.dataListDescription.innerText = active.description;
    }
});