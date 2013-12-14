$(document).ready(function () {

    var positionList = [5, 2, 4, 7, 0, 3, 1, 6];
    var boardSize = 8;

    // draw blank chess board layout
    var p_html = drawBlankBoard(boardSize, "p");
    $("#p-chess").append(p_html);
    drawColorBlocks(boardSize, "p");
    drawQueens(boardSize, positionList, "p");


    $("#btn-apply").on('click', function () {
        var data = {'mutation_prob': $("#mutationProb").val(),
            'max_iterations': $("#maxIteration").val(),
            'nqueens': $("#numOfQueens").val(),
            'population_size': $("#popSize").val()};

        var numOfQueens = data.nqueens;
        $('.ajax-loader').css('display', 'block');
        $.ajax({
            url: '/',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (data) {
                /** @namespace data.found */
                if (data.found == "true") {
                    /** @namespace data.solution_list */
                    var initialPosition = data.solution_list;
//                    alert(data.num_of_iterations);
//                    alert(data.initial_pos_list);
                    initialPosition = initialPosition.split(",");

                    for (var i = 0; i < initialPosition.length; i++) {
                        initialPosition[i] = parseInt(initialPosition[i], 10);

                    }
                    $('.ajax-loader').css('display', 'none');

                    $("#p-chess").html("");
                    var p_html = drawBlankBoard(numOfQueens, "p");
                    $("#p-chess").append(p_html);
                    drawColorBlocks(numOfQueens, "p");
                    drawQueens(numOfQueens, initialPosition, "p");
                }
            }
        });
        return false;
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
    var evenRow;
    var divId = "";
    evenRow = true;
    for (var i = 0; i < boardSize * boardSize; i++) {
        if (i % boardSize == 0 && i != 0) {
            if (boardSize % 2 == 0) {
                evenRow = !evenRow;
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