// dialog

const dialog = document.getElementById('add-book-dialog');
const openBtn = document.getElementById('open-dialog-btn');

function openDialog() {
    dialog.showModal();
}

function closeDialog() {
    dialog.close();
}

openBtn.addEventListener('click', openDialog);

document.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'close-dialog') {
        closeDialog();
    }
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
});

// data

const accents = ['sage', 'amber', 'rose', 'slate', 'teal', 'violet', 'olive', 'coral', 'sky'];
let currentAccentIndex = 0;

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function getNextAccent() {
    const accent = accents[currentAccentIndex];
    currentAccentIndex = (currentAccentIndex + 1) % accents.length;
    return accent;
}

const myLibrary = [];

function addBookToLibrary(book) {
    book.id = generateId();
    book.accent = getNextAccent();
    myLibrary.push(book);
}

// dom

function createBookCard(book) {
    const card = document.createElement('article');
    card.className = 'book-card book-card-enter';
    card.dataset.id = book.id;
    card.dataset.read = book.read;
    card.dataset.accent = book.accent;

    const badgeClass = book.read ? 'book-card__badge--read' : 'book-card__badge--unread';
    const badgeText  = book.read ? 'Read' : 'Unread';
    const toggleText = book.read ? 'Mark Unread' : 'Mark as Read';

    card.innerHTML = `
        <div class="book-card__spine" aria-hidden="true"></div>
        <div class="book-card__body">
            <div class="book-card__content">
                <span class="book-card__badge ${badgeClass}" data-badge>${badgeText}</span>
                <h3 class="book-card__title" data-title>${book.title}</h3>
                <p class="book-card__author" data-author>${book.author}</p>
                <div class="book-card__meta">
                    <svg class="book-card__meta-icon" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <rect x="0.75" y="0.75" width="9.5" height="9.5" rx="1" stroke="currentColor" stroke-width="1.1"/>
                        <path d="M2.5 3.5H8.5M2.5 5.75H8.5M2.5 8H5.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
                    </svg>
                    <span class="book-card__pages" data-pages>${book.pages} pages</span>
                </div>
            </div>
            <div class="book-card__actions">
                <button class="btn btn--sm btn--ghost" data-action="toggle-read" data-id="${book.id}">${toggleText}</button>
                <button class="btn btn--sm btn--danger" data-action="remove-book" data-id="${book.id}" aria-label="Remove ${book.title}">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M2 2L9 9M9 2L2 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Remove
                </button>
            </div>
        </div>
    `;

    return card;
}

function renderLibrary() {
    const grid = document.querySelector('[data-library-grid]');
    grid.innerHTML = '';
    myLibrary.forEach(book => grid.appendChild(createBookCard(book)));
    updateStats();
}

function updateStats() {
    const total  = myLibrary.length;
    const read   = myLibrary.filter(b => b.read).length;
    const unread = total - read;
    const pct    = total === 0 ? 0 : Math.round((read / total) * 100);

    document.querySelector('[data-stat="total"]').textContent  = total;
    document.querySelector('[data-stat="read"]').textContent   = read;
    document.querySelector('[data-stat="unread"]').textContent = unread;
    document.querySelector('[data-progress-text]').textContent = `You've read ${read} of ${total} books`;
    document.querySelector('[data-progress-pct]').textContent  = `${pct}%`;
    document.querySelector('[data-progress-fill]').style.width = `${pct}%`;
}

// actions

function handleAction(element) {
    const action = element.dataset.action;
    const id     = element.dataset.id;

    if (action === 'toggle-read') {
        const book = myLibrary.find(b => b.id === id);
        if (book) {
            book.read = !book.read;
            renderLibrary();
        }
    }

    if (action === 'remove-book') {
        const index = myLibrary.findIndex(b => b.id === id);
        if (index !== -1) {
            myLibrary.splice(index, 1);
            renderLibrary();
        }
    }
}

document.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === 'toggle-read' || action === 'remove-book') {
        handleAction(actionEl);
    }
});

// form

document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form   = e.target;
    const title  = form.title.value.trim();
    const author = form.author.value.trim();
    const pages  = form.pages.value;
    const read   = form.read.checked;

    const newBook = new Book(title, author, pages, read);
    addBookToLibrary(newBook);
    renderLibrary();
    form.reset();
    closeDialog();
});
