$(document).ready(function () {

    var positionList = [5,2,4,7,0,3,1,6];
    var boardSize = 8;

    // draw blank chess board layout
    var p_html = drawBlankBoard(boardSize, "p")
    $("#p-chess").append(p_html);
    drawColorBlocks(boardSize, "p");
    drawQueens(boardSize, positionList, "p");


//    var s_html = drawBlankBoard(boardSize, "s")
//    $("#s-chess").append(s_html);
//    drawColorBlocks(boardSize, "s");
//    drawQueens(boardSize, positionList, "s");

    $("#btn-apply").on('click', function (e) {
        var numOfQueens = parseInt($("#numOfQueens").val(), 10);
        var initialPosition = $("#initialPosition").val().trim();

        initialPosition = initialPosition.split(",");

        if (numOfQueens == initialPosition.length) {
            for (var i = 0; i < initialPosition.length; i++) {
                initialPosition[i] = parseInt(initialPosition[i], 10);
                if (initialPosition[i] >= numOfQueens) {
                    $('#errorModal').modal("show");
                    return;
                }
            }

            $("#p-chess").html("");
            var p_html = drawBlankBoard(numOfQueens, "p")
            $("#p-chess").append(p_html);
            drawColorBlocks(numOfQueens, "p");
            drawQueens(numOfQueens, initialPosition, "p");
        }
        else {
            $('#errorModal').modal("show");
            return;
        }

    });

});

function drawBlankBoard(boardSize, pORs) {
    var str = "<div class='row-block'>";
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            str = str + "</div><div class='row-block'>";
        }
        str = str + "<div id='" + pORs + "-block" + i + "'></div>";
    }
    return str;
}

function drawColorBlocks(boardSize, pORs) {
    var divId = "";
    var evenRow = true;
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            if (boardSize % 2 == 0) {
                if (evenRow) {
                    evenRow = false;
                } else {
                    evenRow = true;
                }
            }
        }
        divId = "#" + pORs + "-block" + i;
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
    }
}


function drawQueens(boardSize, positionList, pORs) {
    for (var j = 0; j < boardSize; j++) {
        var absolutePosition = j * boardSize + positionList[j];
        var divId = "#" + pORs + "-block" + absolutePosition;
        if (j % 2 == 0) {
            if (absolutePosition % 2 == 0) {
                $(divId).removeClass('black').addClass('white-queen');
            } else {
                $(divId).removeClass('white').addClass('black-queen');
            }
        } else {
            if (boardSize % 2 == 0) {
                if (absolutePosition % 2 == 0) {
                    $(divId).removeClass('white').addClass('black-queen');
                } else {
                    $(divId).removeClass('black').addClass('white-queen');
                }
            }
            else {
                if (absolutePosition % 2 == 0) {
                    $(divId).removeClass('black').addClass('white-queen');
                } else {
                    $(divId).removeClass('white').addClass('black-queen');
                }
            }
        }
    }
}