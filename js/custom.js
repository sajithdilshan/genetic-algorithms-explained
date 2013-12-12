$(document).ready(function () {

    var positionList = [0, 1, 2, 3, 4, 5, 6, 7];
    var divId = "";
    var boardSize = 8;

    // draw blank chess board layout
    var str = "<div class='row-block'>";
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            str = str + "</div><div class='row-block'>";
        }
        str = str + "<div id='p-block" + i + "'></div>";
    }

    $("#p-chess").append(str);

    // draw blank chess board layout
    var str = "<div class='row-block'>";
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            str = str + "</div><div class='row-block'>";
        }
        str = str + "<div id='s-block" + i + "'></div>";
    }

    $("#s-chess").append(str);
    $("#s-chess").html("");
    $("#s-chess").append(str);

    // fill chess board with black and white blocks
    var evenRow = true;
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            if (evenRow) {
                evenRow = false;
            } else {
                evenRow = true;
            }
        }
        divId = "#p-block" + i;
        if (evenRow) {
            if (i % 2 == 0) {
                $(divId).addClass('black');
            } else {
                $(divId).addClass('white');
            }
        } else {
            if (i % 2 == 0) {
                $(divId).addClass('white');
            } else {
                $(divId).addClass('black');
            }
        }
    } //end of for loop

    // fill chess board with black and white blocks
    var evenRow = true;
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            if (evenRow) {
                evenRow = false;
            } else {
                evenRow = true;
            }
        }
        divId = "#s-block" + i;
        if (evenRow) {
            if (i % 2 == 0) {
                $(divId).addClass('black');
            } else {
                $(divId).addClass('white');
            }
        } else {
            if (i % 2 == 0) {
                $(divId).addClass('white');
            } else {
                $(divId).addClass('black');
            }
        }
    } //end of for loop

    // draws the queens on chess board
    for (var j = 0; j < boardSize; j++) {
        var absolutePosition = j * boardSize + positionList[j];
        divId = "#p-block" + absolutePosition;
        if (j % 2 == 0) {
            if (absolutePosition % 2 == 0) {
                $(divId).removeClass('black').addClass('white-queen');
            } else {
                $(divId).removeClass('white').addClass('black-queen');
            }
        } else {
            if (absolutePosition % 2 == 0) {
                $(divId).removeClass('white').addClass('black-queen');
            } else {
                $(divId).removeClass('black').addClass('white-queen');
            }
        }
    }

});