//    Copyright © 2013 Sajith Dilshan <sajithdilshan@gmail.com>
//    This work is free. You can redistribute it and/or modify it under the
//    terms of the Do What The Fuck You Want To Public License, Version 2,
//    as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

$(document).ready(function () {

    var positionList = [5, 2, 4, 7, 0, 3, 1, 6];
    var boardSize = 8;

    // draw initial chess board layout
    var p_html = drawBlankBoard(boardSize, "p");
    $("#p-chess").append(p_html);
    drawColorBlocks(boardSize, "p");
    drawQueens(boardSize, positionList, "p");

    // after clicking solve button
    $("#btn-apply").on('click', function () {

        var mutation_prob = parseFloat($("#mutationProb").val());
        var max_iterations = parseInt($("#maxIteration").val());
        var population_size = parseInt($("#popSize").val());
        var numOfQueens = parseInt($("#numOfQueens").val());

        // incorrect parameter handling
        $("#model-body-content").html("");

        if (mutation_prob < 0 || mutation_prob > 1 || isNaN(mutation_prob)) {
            $("#model-body-content").append("Mutation probability should be a floating number between 0 and 1.");
            $('#errorModal').modal('show');
            return false;
        }
        if (max_iterations < 0 || isNaN(max_iterations)) {
            $("#model-body-content").append("Maximum number of iterations should be a positive integer");
            $('#errorModal').modal('show');
            return false;
        }
        if (numOfQueens < 8 || numOfQueens > 20 || isNaN(numOfQueens)) {
            $("#model-body-content").append("Number of queens should be a positive integer between 8 and 20 (including).");
            $('#errorModal').modal('show');
            return false;
        }
        if (population_size < 0 || isNaN(population_size)) {
            $("#model-body-content").append("Population size should be a positive integer");
            $('#errorModal').modal('show');
            return false;
        }

        // display ajax loader
        $('.ajax-loader').css('display', 'block');

        // sending ajax request
        var data = {'mutation_prob': mutation_prob,
            'max_iterations': max_iterations,
            'nqueens': numOfQueens,
            'population_size': population_size};

        $.ajax({
            url: '/',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (data) {
                /** @namespace data.found */
                if (data.found == "true") {
                    /** @namespace data.solution_list */
                    var solutionPositionList = data.solution_list;
                    solutionPositionList = solutionPositionList.split(",");

                    for (var i = 0; i < solutionPositionList.length; i++) {
                        solutionPositionList[i] = parseInt(solutionPositionList[i], 10);
                    }
                    // hide ajax loader
                    $('.ajax-loader').css('display', 'none');

                    //draw solution
                    $("#p-chess").html("");
                    var p_html = drawBlankBoard(numOfQueens, "p");
                    $("#p-chess").append(p_html);
                    drawColorBlocks(numOfQueens, "p");
                    drawQueens(numOfQueens, solutionPositionList, "p");

                    return true;

                } else {
                    //hide ajax loader
                    $('.ajax-loader').css('display', 'none');

                    //show error message
                    $("#model-body-content").append("Could not find a solution below the number of maximum number of iterations. Try again with a larger maximum number of iteration value.");
                    $('#errorModal').modal('show');
                    return false;
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