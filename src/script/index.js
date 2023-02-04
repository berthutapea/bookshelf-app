const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';

inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})

function generateBookObject(id, title, author, year, category, image, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        category,
        image,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function findBookTitle(bookTitle) {
    for (const Booktitle in books) {
        if (Booktitle.title === bookTitle) {
            return Booktitle;
        }
    }
    return 1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        category,
        image,
        isCompleted
    } = bookObject;

    const bookImage = document.createElement('img');
    bookImage.setAttribute('src', `${image}`);

    const bookCover = document.createElement('div');
    bookCover.classList.add('BookCover');
    bookCover.append(bookImage);

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('BookTitle');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('div');
    bookAuthor.classList.add('BookAuthor');
    bookAuthor.innerText = author;

    const bookGenre = document.createElement('div');
    bookGenre.classList.add('BookGenre');
    bookGenre.innerText = category;

    const bookYear = document.createElement('div');
    bookYear.classList.add('year');
    bookYear.innerText = year;

    const BookDetail = document.createElement('div');
    BookDetail.classList.add('bookDetail');
    BookDetail.append(bookTitle, bookAuthor, bookGenre, bookYear);

    const iconDelete = document.createElement('div');
    iconDelete.classList.add('fa', 'fa-trash');

    const iconChecklist = document.createElement('div');
    iconChecklist.classList.add('fa', 'fa-check');

    const iconDoubleChecklist = document.createElement('div');
    iconDoubleChecklist.classList.add('fa', 'fa-check-double');

    const bookCard = document.createElement('div');
    bookCard.classList.add('Book', 'shadow')
    bookCard.append(bookCover, BookDetail);
    bookCard.setAttribute('id', `book-${id}`);

    // const isCompletedBook = document.getElementById("inputBookIsCompleted");
    if (isCompleted) {
        const buttonDoubleChecklist = document.createElement('button');
        buttonDoubleChecklist.setAttribute('id', `checklist`);
        buttonDoubleChecklist.append(iconDoubleChecklist);
        buttonDoubleChecklist.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('id', `delete`);
        buttonDelete.append(iconDelete);
        buttonDelete.addEventListener('click', function () {
            removeBook(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(buttonDoubleChecklist, buttonDelete);

        bookCard.append(actionButton);
    } else {
        const buttonChecklist = document.createElement('button');
        buttonChecklist.setAttribute('id', `checklist`);
        buttonChecklist.append(iconChecklist);
        buttonChecklist.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('id', `delete`);
        buttonDelete.append(iconDelete);
        buttonDelete.addEventListener('click', function () {
            removeBook(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(buttonChecklist, buttonDelete);

        bookCard.append(actionButton);
    }
    return bookCard;
}
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const bookTitle = document.getElementById("inputBookTitle").value
        const bookAuthor = document.getElementById("inputBookAuthor").value
        const bookYear = document.getElementById("inputBookYear").value
        const bookCategory = document.getElementById("inputBookCategory").value
        const bookImage = document.getElementById("inputBookImage").value
        const bookIsCompleted = document.getElementById("inputBookIsComplete").checked

        const newBook = {
            id: +new Date(),
            title: bookTitle,
            author: bookAuthor,
            year: bookYear,
            category: bookCategory,
            image: bookImage,
            isComplete: bookIsCompleted
        }

        const toast = document.createElement('div');
        toast.classList.add('toast');
        if (typeof Storage !== undefined) {
            const bookObject = generateBookObject(newBook.id, newBook.title, newBook.author, newBook.year, newBook.category, newBook.image, newBook.isComplete);
            books.push(bookObject)
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

            toast.style.opacity = '1';
            toast.style.top = '10px';
            toast.style.visibility = 'visible';
            toast.style.maxWidth = '400px';
            toast.style.borderColor = '#00c02b';
            toast.style.background = '#00c02b';
            toast.style.color = '#fff';
            toast.style.justifyContent = 'center';
            toast.style.alignItems = 'center';
            toast.innerHTML = `Buku  <b>&nbsp;${newBook.title}&nbsp;</b>  berhasil ditambahkan`;
            document.body.append(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.top = '0px';
                toast.style.visibility = 'hidden';
                toast.style.borderColor = 'transparent';
                toast.style.background = 'transparent';
            }, 1500);
        } else {
            alert("Browser yang Anda gunakan tidak mendukung Web Storage")
        }

    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

searchSubmit.addEventListener("click", function (event) {
    event.preventDefault()

    const searchTitle = document.querySelector("#search-txt");
    const searchResult = document.querySelector('#search>.BookCard');

    searchResult.innerHTML = '';
    searchResult.innerHTML += `<p>Hasil pencarian judul buku <b>${searchTitle.value}</b></p>`;

    for (const bookItem of books) {
        if (bookItem.title.toLowerCase().includes(searchTitle.value.toLowerCase())) {
            if (bookItem.isCompleted === true) {

                const bookImage = document.createElement('img');
                bookImage.setAttribute('src', `${bookItem.image}`);

                const bookCover = document.createElement('div');
                bookCover.classList.add('BookCover');
                bookCover.append(bookImage);

                const bookTitle = document.createElement('div');
                bookTitle.classList.add('bookTitle');
                bookTitle.innerText = bookItem.title;

                const bookAuthor = document.createElement('div');
                bookAuthor.classList.add('BookAuthor');
                bookAuthor.innerText = bookItem.author;

                const bookGenre = document.createElement('div');
                bookGenre.classList.add('BookGenre');
                bookGenre.innerText = bookItem.category;

                const bookStatus = document.createElement('div');
                bookStatus.classList.add('status', 'Complete')
                bookStatus.innerText = 'Selesai Dibaca';

                const bookDetail = document.createElement('div');
                bookDetail.classList.add('bookDetail');
                bookDetail.append(bookTitle, bookAuthor, bookGenre, bookStatus);

                const iconDelete = document.createElement('div');
                iconDelete.classList.add('fa', 'fa-trash');

                const iconDoubleChecklist = document.createElement('div');
                iconDoubleChecklist.classList.add('fa', 'fa-check-double');

                const buttonDoubleChecklist = document.createElement('button');
                buttonDoubleChecklist.setAttribute('id', `checklist`);
                buttonDoubleChecklist.append(iconDoubleChecklist);
                buttonDoubleChecklist.addEventListener('click', function () {
                    undoBookFromCompleted(bookItem.id);
                });

                const buttonDelete = document.createElement('button');
                buttonDelete.setAttribute('id', `delete`);
                buttonDelete.append(iconDelete);
                buttonDelete.addEventListener('click', function () {
                    removeBook(bookItem.id);
                });

                const actionButton = document.createElement('div');
                actionButton.classList.add('actionButton');
                actionButton.append(buttonDoubleChecklist, buttonDelete);

                const bookCard = document.createElement('div');
                bookCard.classList.add('Book', 'shadow')
                bookCard.append(bookCover, bookDetail, actionButton);

                searchResult.append(bookCard);
            } else {

                const bookImage = document.createElement('img');
                bookImage.setAttribute('src', `${bookItem.image}`);

                const bookCover = document.createElement('div');
                bookCover.classList.add('BookCover');
                bookCover.append(bookImage);

                const bookTitle = document.createElement('div');
                bookTitle.classList.add('bookTitle');
                bookTitle.innerText = bookItem.title;

                const bookAuthor = document.createElement('div');
                bookAuthor.classList.add('BookAuthor');
                bookAuthor.innerText = bookItem.author;

                const bookGenre = document.createElement('div');
                bookGenre.classList.add('BookGenre');
                bookGenre.innerText = bookItem.category;

                const bookStatus = document.createElement('div');
                bookStatus.classList.add('status', 'Incomplete')
                bookStatus.innerText = 'Belum Selesai'

                const bookDetail = document.createElement('div');
                bookDetail.classList.add('bookDetail');
                bookDetail.append(bookTitle, bookAuthor, bookGenre, bookStatus);

                const iconDelete = document.createElement('div');
                iconDelete.classList.add('fa', 'fa-trash');

                const iconChecklist = document.createElement('div');
                iconChecklist.classList.add('fa', 'fa-check');

                const buttonChecklist = document.createElement('button');
                buttonChecklist.setAttribute('id', `checklist`);
                buttonChecklist.append(iconChecklist);
                buttonChecklist.addEventListener('click', function () {
                    addBookToCompleted(bookItem.id);
                });

                const buttonDelete = document.createElement('button');
                buttonDelete.setAttribute('id', `delete`);
                buttonDelete.append(iconDelete);
                buttonDelete.addEventListener('click', function () {
                    removeBook(bookItem.id);
                });

                const actionButton = document.createElement('div');
                actionButton.classList.add('actionButton');
                actionButton.append(buttonChecklist, buttonDelete);

                const bookCard = document.createElement('div');
                bookCard.classList.add('Book', 'shadow')
                bookCard.append(bookCover, bookDetail, actionButton);

                searchResult.append(bookCard);
            }
        }
    }
});

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    const container = document.querySelector('.container');

    if (bookTarget === -1) return;

    const input = document.createElement('input');
    input.setAttribute('type', `checkbox`);
    input.setAttribute('id', `check`);

    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-exclamation');

    const Popup = document.createElement('div');
    Popup.classList.add('popup_box');
    Popup.style.opacity = '1';
    Popup.style.position = 'fixed';
    Popup.style.pointerEvents = 'auto';

    const description = document.createElement('h1');
    description.innerText = 'Apakah kamu yakin ingin menghapus buku ini?';

    const label = document.createElement('label');
    label.innerText = 'Jika yakin, klik button "Hapus"';

    const background = document.createElement('div');
    background.classList.add('background');
    background.style.opacity = '1';
    background.style.pointerEvents = 'auto';

    const btnCancel = document.createElement('a');
    btnCancel.setAttribute('class', `btn1`);
    btnCancel.innerText = 'Batal';
    btnCancel.addEventListener('click', function (event) {
        event.preventDefault()
        Popup.style.opacity = '0';
        Popup.style.pointerEvents = 'none';
        background.style.opacity = '0';
        background.style.pointerEvents = 'none';
    });

    const toast = document.createElement('div');
    toast.classList.add('toast');

    const btnDelete = document.createElement('a');
    btnDelete.setAttribute('class', `btn2`);
    btnDelete.innerText = 'Hapus';
    btnDelete.addEventListener('click', function (event) {
        event.preventDefault()
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        Popup.style.opacity = '0';
        Popup.style.pointerEvents = 'none';
        background.style.opacity = '0';
        background.style.pointerEvents = 'none';

        toast.style.opacity = '1';
        toast.style.top = '10px';
        toast.style.visibility = 'visible';
        toast.style.maxWidth = '200px';
        toast.style.borderColor = '#FA532E';
        toast.style.background = '#FA532E';
        toast.style.color = '#fff';
        toast.innerText = 'Buku berhasil dihapus';
        document.body.append(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.top = '0px';
            toast.style.visibility = 'hidden';
            toast.style.borderColor = 'transparent';
            toast.style.background = 'transparent';
        }, 1500);
    });

    const button = document.createElement('button');
    button.setAttribute('class', `btns`);
    button.append(btnDelete, btnCancel);

    Popup.append(icon, description, label, button);

    container.append(input, background, Popup);
}

function undoBookFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleteBook');
    const listCompleted = document.getElementById('completeBook');

    // clearing list item
    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted === true) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});