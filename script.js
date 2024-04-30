/*! Bukumark | MIT License | https://github.com/LIGMATV/Bukumark */

function toggleElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {

        var allElements = document.querySelectorAll('.hidden');
        allElements.forEach(function(e) {
            if (e !== element) {
                e.style.display = 'none';
            }
        });

        element.style.display = (element.style.display === 'none') ? 'block' : 'none';
    }
}

function changeBackground() {
    var imageUrl = document.getElementById('backgroundUrl').value;

    if (imageUrl) {
        document.body.style.backgroundImage = "url('" + imageUrl + "')";

        saveBackgroundUrlToLocalStorage(imageUrl);
    }
}

window.addEventListener('load', function() {
    var savedBackgroundUrl = getBackgroundUrlFromLocalStorage();
    if (savedBackgroundUrl) {
        document.body.style.backgroundImage = "url('" + savedBackgroundUrl + "')";
    }
});

function saveBackgroundUrlToLocalStorage(url) {
    localStorage.setItem('backgroundUrl', url);
}

function getBackgroundUrlFromLocalStorage() {
    return localStorage.getItem('backgroundUrl');
}

var bookmarks = [];

function addBookmark() {
    var siteName = document.getElementById('siteName').value;
    var siteURL = document.getElementById('siteURL').value;

    var bookmark = {
        name: siteName,
        url: siteURL
    };

    bookmarks.push(bookmark);

    renderBookmarks();
    saveBookmarksToLocalStorage();
    document.getElementById('bookmarkForm').reset();
}

function renderBookmarks() {
    var bookmarkList = document.getElementById('bookmarkList');
    bookmarkList.innerHTML = '';

    bookmarks.forEach(function(bookmark, index) {
        var bookmarkDiv = document.createElement('div');
        bookmarkDiv.className = 'bookmark';
        bookmarkDiv.id = `bookmark-${index}`;
        bookmarkDiv.setAttribute('data-index', index);

        var link = document.createElement('a');
        link.href = bookmark.url;
        link.target = '_blank';
        link.title = bookmark.name;

        var favicon = document.createElement('img');
        favicon.className = 'favicon';
        favicon.src = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`;
        favicon.alt = 'Favicon';

        var linkText = document.createElement('div');
        linkText.className = 'bookmark-text';
        linkText.textContent = bookmark.name;

        link.appendChild(favicon);
        link.appendChild(linkText);

        bookmarkDiv.appendChild(link);

        bookmarkDiv.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            setupContextMenu(index, event.clientX, event.clientY);
        });

        bookmarkList.appendChild(bookmarkDiv);
    });
}

function setupContextMenu(index, x, y) {
    var contextMenu = document.getElementById('contextMenu');
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';

    contextMenu.innerHTML = '';

    var editOption = document.createElement('div');
    editOption.textContent = 'Edit';
    editOption.addEventListener('click', function() {
        var newName = prompt('🅱️ Edit bookmark name', bookmarks[index].name);
        if (newName !== null) {
            bookmarks[index].name = newName;
            renderBookmarks();
            hideContextMenu();
            saveBookmarksToLocalStorage();
        }
    });
    contextMenu.appendChild(editOption);

    var deleteOption = document.createElement('div');
    deleteOption.textContent = 'Delete';
    deleteOption.addEventListener('click', function() {
        var confirmDelete = confirm("🅱️ Delete this bookmark?!");
        if (confirmDelete) {
            bookmarks.splice(index, 1);
            renderBookmarks();
            hideContextMenu();
            saveBookmarksToLocalStorage();
        }
    });
    contextMenu.appendChild(deleteOption);


    var copyLinkOption = document.createElement('div');
    copyLinkOption.textContent = 'Copy Link';
    copyLinkOption.addEventListener('click', function() {
        var tempInput = document.createElement('input');
        tempInput.value = bookmarks[index].url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        hideContextMenu();
    });
    contextMenu.appendChild(copyLinkOption);


    window.addEventListener('click', function hideContextMenuOnOutsideClick(event) {
        if (!contextMenu.contains(event.target)) {
            hideContextMenu();
            window.removeEventListener('click', hideContextMenuOnOutsideClick);
        }
    });

    showContextMenu();
}

function showContextMenu() {
    var contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
}

function hideContextMenu() {
    var contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
}

function exportBookmarks() {
    var data = JSON.stringify(bookmarks);
    var blob = new Blob([data], {
        type: 'application/json'
    });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'bukumark.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importBookmarks() {
    var input = document.getElementById('importFile');
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = e.target.result;

            try {
                bookmarks = JSON.parse(data);
                renderBookmarks();
                saveBookmarksToLocalStorage();
            } catch (error) {
                alert('Error parsing JSON file');
            }
        };

        reader.readAsText(file);
    }
}

function saveBookmarksToLocalStorage() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function loadBookmarksFromLocalStorage() {
    var storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
        renderBookmarks();
    } else {
        bookmarks = [];
    }
}

loadBookmarksFromLocalStorage();