// GLOBALS cause I just want this to be done kinda quickly.
var items;
var currentBook;
var currentChapter;

$.getJSON("json/t_kjv.json", function(data) {
    items = [];
    $.each(data, function(key, val) {
        $.each(val.row, function(key2, val2) {

            var book = val2.field[1]
            var chapter = val2.field[2]
            var verse = val2.field[3]
            items.push({
                bookNumber: book,
                chapter: chapter,
                verse: verse,
                text: val2.field[4],

            })
        })

    });

    $.getJSON("json/key_english.json", function(data) {
        var keys = data.resultset.keys;
        $.each(items, function(key, value) {
            items[key].bookName = keys[value.bookNumber - 1].n;
        });
        $.each(keys, function(key, value) {
            $("#bookSelector").append("<option value = " + value.b + ">" + value.n + "</option>")
        })
    }).then(function() { chooseBook(1) });

});

/**
 * chooseBook
 * 
 * @param {*} bookNumber 
 */
function chooseBook(bookNumber) {
    var book = getBook("", bookNumber);
    setCurrentBook(book);
    var chapter = getChapter(1);
    setCurrentChapter(chapter);
    displayChapter();
    setChapterSelector();
}

/**
 * 
 * @param {*} chapterNumber 
 */
function chooseChapter(chapterNumber) {
    var chapter = getChapter(chapterNumber);
    setCurrentChapter(chapter);
    displayChapter();
}

/**
 * 
 */
function nextChapter() {
    var nextChapterNumber = currentChapter[0].chapter + 1;
    if (currentBook[currentBook.length - 1].chapter < nextChapterNumber) {
        nextChapterNumber = 1;
        setCurrentBook(getBook("", currentBook[0].bookNumber + 1));
    }

    var element = document.getElementById("chapterSelector");
    element.value = nextChapterNumber;
    setCurrentChapter(getChapter(nextChapterNumber));
    displayChapter();
}

function backChapter() {
    var backChapterNumber = currentChapter[0].chapter - 1;
    if (backChapterNumber == 0) {
        setCurrentBook(getBook("", currentBook[0].bookNumber - 1));
        backChapterNumber = currentBook[currentBook.length - 1].chapter;
    }
    setCurrentChapter(getChapter(backChapterNumber));
    displayChapter();
}

/**
 * displayChapter
 * 
 * @param {*} number 
 */
function displayChapter() {

    if (currentBook == undefined) {
        setCurrentBook(getBook("Genesis"));
    }
    $('.currentChapter').empty();
    $('.currentChapter').append(currentBook[0].bookName + " " + currentChapter[0].chapter.toString());
    $('#ChapterDisplay').empty();
    $.each(currentChapter, function(key, val) {
        $('#ChapterDisplay').append("<p class='verseText' onclick='void(0)'> <span class='verse'>" + val.verse + "</span>" + val.text + "</p>");
    });
    setTheReadingPreference();
}

/**
 * getBook
 * 
 * @param {*} bookName 
 * @param {*} bookNumber 
 */
function getBook(bookName = "", bookNumber = -1) {
    var book = [];
    if (bookNumber != -1) {
        $.each(items, function(key, val) {
            if (val.bookNumber == bookNumber) {
                book.push(val);
            }
        });
    } else {
        $.each(items, function(key, val) {
            if (val.bookName == bookName) {
                book.push(val);
            }
        });
    }
    return book;
}

/**
 * setCurrentBook
 * 
 * @param {*} bookObject 
 */
function setCurrentBook(bookObject) {
    currentBook = bookObject;
}

/**
 * getChapter
 * 
 * @param {*} chapterNumber 
 */
function getChapter(chapterNumber) {
    chapter = [];

    $.each(currentBook, function(key, val) {
        if (val.chapter == chapterNumber) {
            chapter.push(val);
        }
    });

    return chapter;
}

/**
 * setCurrentChapter
 * 
 * @param {*} chapterObject 
 */
function setCurrentChapter(chapterObject) {
    currentChapter = chapterObject;
}



function setChapterSelector() {
    $("#chapterSelector").empty();

    var pushedChapter = 1;
    $("#chapterSelector").append("<option>" + pushedChapter + "</option>");
    $.each(currentBook, function(key, val) {
        if (val.chapter != pushedChapter) {
            pushedChapter = val.chapter;
            $("#chapterSelector").append("<option value=" + pushedChapter + ">" + pushedChapter + "</option>");
        }
    })
}

function setTheReadingPreference() {
    var verses = document.getElementsByClassName('verseText');
    var newStyle = '';

    if (document.getElementById('versebyverse').checked) {
        newStyle = "display: block;";
    } else {
        newStyle = "display: inline;";
    }

    for (var i = 0; i < verses.length; i++) {
        verses[i].style = newStyle
    }

}


// sets up the two buttons
window.onload = function() {
    $('#backAChapter').click(function() {
        console.log('backChapter');
        backChapter()
    });
    $('#forwardAChapter').click(function() {
        console.log('nextChapter');
        nextChapter()
    });
    $('#bookSelector').change(function() {
        chooseBook(this.value);
    });
    $('#chapterSelector').change(function() {
        chooseChapter(this.value);
    });
    $('#versebyverse').click(function() {
        setTheReadingPreference();
    });
};