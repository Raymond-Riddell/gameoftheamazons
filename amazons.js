var CombinatorialGame = Class.create({

    /**
     * Determines whether the given player has an option
     */
    hasOption: function(player, position) {
        if (position == null || position === undefined) {
            return false;
        }
        var options = this.getOptionsForPlayer(player);
        // console.log("Player " + player + " has " + options.length + " options.");
        for (var i = 0; i < options.length; i++) {
            // console.log("The option is: " + options[i]);
            if (options[i].equals(position)) return true;
        }
        return false;
    }

    /**
     * Returns a simplified form of this game, which must be equivalent.  This should be implemented in subclasses to improve performance for dynamic-programming AIs I haven't written yet. :-P
     */
    ,simplify: function() {
        return this.clone();
    }

    /**
     * Gets the player's identity (Blue/Black/Vertical/etc) as a string.
     */
    ,getPlayerName: function(playerIndex) {
        return this.__proto__.PLAYER_NAMES[playerIndex];
    }


});
//declare constants
CombinatorialGame.prototype.LEFT = 0;
CombinatorialGame.prototype.RIGHT = 1;
CombinatorialGame.prototype.PLAYER_NAMES = ["Left", "Right"];

//end of CombinatorialGame




var Amazons = Class.create(CombinatorialGame, {

    initialize: function(size, numBlueAmazons, numRedAmazons) {
        numBlueAmazons = numBlueAmazons || numRedAmazons;
        this.playerNames = Amazons.prototype.PLAYER_NAMES;
        const width = size;
        const height = size;

        this.board = [];
        for (var i = 0; i < width; i++) {
            const column = [];
            for (var j = 0; j < height; j++) {
                column.push("blank");
            }
            this.board.push(column);
        }

        this.board[3][0] = "amazon blue";
        this.board[6][0] = "amazon blue";
        this.board[0][3] = "amazon blue";
        this.board[9][3] = "amazon blue";

        this.board[0][6] = "amazon red";
        this.board[9][6] = "amazon red";
        this.board[3][9] = "amazon red";
        this.board[6][9] = "amazon red";

        if (numBlueAmazons < 0 || numRedAmazons < 0) {
            console.log("ERROR: trying to create a game with negative Amazons!");
            return;
        } else if (Math.max(numBlueAmazons, numRedAmazons) > (width + height) / 2) {
            console.log("ERROR: too many Amazons chosen, so we're going down to " + size + " Amazons per side.");
        }
    },

    getBoard: function() {
        return this.board;
    },

    getWidth: function() {
        return this.board.length;
    },

    getHeight: function() {
        return this.board[0].length;
    },

    getNumAmazons: function() {
        var count = 0;
        const pieceName = "amazon " + (playerId == 0 ? "blue" : "red");
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] == pieceName) {
                    count ++;
                }
            }
        }
        return count;
    },

    /**
     * Equals!
     */
    equals: function(other) {
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] != other.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    },

    clone: function() {
        var clone = new Amazons(100, 0, 0);
        clone.board = [];
        for (var i = 0; i < this.getWidth(); i++) {
            const col = [];
            for (var j = 0; j < this.getHeight(); j++) {
                col.push(this.board[i][j]);
            }
            clone.board.push(col);
        }
        return clone;
    },

    coordinatesEquals: function(coordsA, coordsB) {
        return coordsA[0] == coordsB[0] && coordsA[1] == coordsB[1];
    },

    // Returns the locations of the Amazons for a specified player.
    getAmazons: function(playerId) {
        const amazons = [];
        const amazonName = "amazon " + (playerId == 0 ? "blue" : "red");
        // console.log(amazonName);
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                const contents = this.board[i][j];
                if (contents == amazonName) {
                    amazons.push([i, j]);
                }
            }
        }
        return amazons;
    },

    // returns a list of available tiles for the Amazon to move to
    movableTiles: function(amazonLoc, board) {
        
        const moves = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j< board[0].length; j++) {
                if (board[i][j] != "stone" && this.canMoveQueenly(amazonLoc[0], amazonLoc[1], i, j) && (amazonLoc[0] != i || amazonLoc[1] != j)) {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    },

    canMoveQueenly: function(qR, qC, oR, oC) {
        


        // If queen and the opponent are in the same row
        if (qR == oR) {
            if (qC < oC) {
                for (var i = qC + 1; i < oC; i++) {
                    if (this.board[qR][i] == "stone" || this.board[qR][i] == "amazon blue" || this.board[qR][i] == "amazon red") {
                        return false;
                    }
                }
            }
            else if (qC > oC) {
                for (var i = oC + 1; i < qC; i++) {
                    if (this.board[qR][i] == "stone" || this.board[qR][i] == "amazon blue" || this.board[qR][i] == "amazon red") {
                        return false;
                    }
                }
            }
            return true;
        }
    
        // If queen and the opponent are in the same column
        if (qC == oC) {
            if (qR < oR) {
                for (var i = qR + 1; i < oR; i++) {
                    if (this.board[i][qR] == "stone" || this.board[i][qR] == "amazon blue" || this.board[i][qR] == "amazon red") {
                        return false;
                    }
                }
            }
            else if (qR > oR) {
                for (var i = oR + 1; i < qR; i++) {
                    if (this.board[i][qR] == "stone" || this.board[i][qR] == "amazon blue" || this.board[i][qR] == "amazon red") {
                        return false;
                    }
                }
            }
            return true;
        }
    
        // If queen can attack diagonally
        if (Math.abs(qR - oR) == Math.abs(qC - oC)) {
            // top-right diagonal
            if (qR > oR && qC < oC) {
                for (var i = qC; i < oC; i++) {
                    if (this.board[i][qR] == "stone" || this.board[i][qR] == "amazon blue" || this.board[i][qR] == "amazon red") {
                        return false;
                    }
                    qR -= 1;
                }
            }
            // bottom-right diagonal
            else if (qR < oR && qC < oC) {
                for (var i = qC; i < oC; i++) {
                    if (this.board[i][qR] == "stone" || this.board[i][qR] == "amazon blue" || this.board[i][qR] == "amazon red") {
                        return false;
                    }
                    qR += 1
                }
            }
            // bottom-left diagonal
            else if (qR < oR && qC > oC) {
                for (var i = oC; i < qC; i++) {
                    if(this.board[i][oR] == "stone" || this.board[i][oR] == "amazon blue" || this.board[i][oR] == "amazon red") {
                        return false;
                    }
                    oR += 1;
                }
            }
            // top-right diagonal
            else {
                for (var i = oC; i < qC; i++) {
                    if (this.board[i][oR] == "stone" || this.board[i][oR] == "amazon blue" || this.board[i][oR] == "amazon red") {
                        return false;
                    }
                    oR -= 1;
                }
            }
            return true;
        }
    
        // Opponent is safe
        return false;
    },

    getOptionsForPlayer: function(playerId) {
        const amazons = this.getAmazons(playerId);
        const options = [];
        const optionsFirstHalf = [];

        for (var i = 0; i < amazons.length; i++) {
            const amazon = amazons[i];
            const oneAmazonsMoves = this.movableTiles(amazon, this.board);
            
            for (var j = 0; j < oneAmazonsMoves.length; j++) {
                const copy = this.clone();
                // Move the Amazon to the new space
                copy.getBoard()[oneAmazonsMoves[j][0]][oneAmazonsMoves[j][1]] = "amazon " + (playerId == 0 ? "blue" : "red");
                // Change the Amazon's old space to a blank
                copy.getBoard()[amazon[0]][[amazon[1]]] = "blank";
                // Yeet that bitch
                optionsFirstHalf.push(copy);
            }
        }

        var cloneOptions = [];
        for (var i = 0; i < optionsFirstHalf.length; i++) {
            cloneOptions.push(optionsFirstHalf[i].clone());
        }

        for (var i = 0; i < optionsFirstHalf.length; i++) {
            // Find the Amazon locations of that instance
            var halfAmazons = optionsFirstHalf[i].getAmazons(playerId);
            // console.log("FIRST HALF OF MOVEMENT: " + halfAmazons);
            // Parse through all of current player's Amazons
            for (var j = 0; j < halfAmazons.length; j++) {
                const amazon = halfAmazons[j];
                const oneAmazonsTilesToDestroy = optionsFirstHalf[i].movableTiles(amazon, optionsFirstHalf[i].getBoard());
                // Parse through all the tiles that Amazon can destroy
                for (var k = 0; k < oneAmazonsTilesToDestroy.length; k++) {
                    const secondHalfCopy = optionsFirstHalf[i];
                    // Change the tile to destroyed
                    // console.log(oneAmazonsTilesToDestroy[1]);
                    const clone = optionsFirstHalf[i].clone();
                    clone.getBoard()[oneAmazonsTilesToDestroy[k][0]][oneAmazonsTilesToDestroy[k][1]] = "stone";
                    // Yeet that bitch(respectfully)
                    options.push(clone);
                }
            }
        }
        return options;
    },

    getOptionFromMove: function(amazonTile, moveToTile, stoneTile) {
        if (this.canMoveQueenly(amazonTile[0], amazonTile[1], moveToTile[0], moveToTile[1]) && this.canMoveQueenly(moveToTile[0], moveToTile[1], stoneTile[0], stoneTile[1])) {
            const option = this.clone();
            const amazonString = option.board[amazonTile[0]][amazonTile[1]];
            option.board[moveToTile[0]][moveToTile[1]] = amazonString;
            option.board[amazonTile[0]][amazonTile[1]] = "blank";
            option.board[stoneTile[0]][stoneTile[1]] = "stone";

            return option;
        }
        else {
            return null;
        }
    }
});
Amazons.prototype.PLAYER_NAMES = ["Blue", "Red"];

const InteractiveAmazonsView = Class.create({

    initialize: function(position) {
        this.position = position;
        this.selectedTile = undefined;
        this.selectedMove = undefined;
    },

    draw: function(containerElement, listener) {
        this.selectedTile = undefined;
        //let's write the board contents out so we can traverse it that way
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        var boardWidth = Math.min(getAvailableHorizontalPixels(containerElement), window.innerWidth - 200);
        var boardPixelSize = Math.min(window.innerHeight, boardWidth);
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100
        boardSvg.setAttributeNS(null, "width", boardPixelSize);
        boardSvg.setAttributeNS(null, "height", boardPixelSize);
        
        //get some dimensions based on the canvas size
        var maxCircleWidth = (boardPixelSize - 10) / width;
        var maxCircleHeight = (boardPixelSize - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var boxSide = maxDiameter;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1-padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);
        
        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);
        
        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex ++) {
                var text = "";
                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide+1);
                square.setAttributeNS(null, "height", boxSide+1);
                square.style.stroke = "black";
                square.style.strokeWith = 2;
                square.style.fill = "white";
                var content = this.position.board[colIndex][rowIndex];
                if (content.includes("stone")) {
                    square.style.fill = "gray";
                }
                if (content.includes("amazon")) {
                    text = "A";
                    //text = "￼￼￼🐍"; //this is a green snake
                }
                const textColor = (content.includes("blue")) ? "blue" : "red";
                
                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.box = square; // so the text and this can both refer to the square itself
                    square.onclick = function(event) {player.handleClick(event);}
                    square.text = text;
                    square.color = textColor;
                }
                boardSvg.appendChild(square);
                
                if (text != "") {
                    const textBuffer = Math.ceil(.17 * boxSide);
                    const textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", x + textBuffer);//+ 20);
                    textElement.setAttributeNS(null, "y", y + boxSide - textBuffer );//+ 20);
                    const textSize = Math.ceil(.8 * boxSide);
                    textElement.setAttributeNS(null, "font-size",  textSize);
                    //textElement.setAttributeNS(null, "color", textColor);
                    textElement.style.fill = textColor;
                        
                    textElement.textContent = text;
                    textElement.column = colIndex;
                    textElement.row = rowIndex;
                    textElement.box = square;
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "single";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.box = square; // so the text and this can both refer to the square itself
                        square.onclick = function(event) {player.handleClick(event);}
                        textElement.onclick = function(event) {player.handleClick(event);}
                    }
                    boardSvg.appendChild(textElement);
                }
            }
        }
        this.graphics = boardSvg;
    },

    selectTile: function(tile) {
        this.selectedTile = tile;
        this.selectedTile.oldColor = this.selectedTile.style.fill;
        this.selectedTile.style.fill = "yellow";
        // this.addXs();
    },

    deselectTile: function() {
        this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
        // this.removeXs();
    },

    selectMoveTile: function(tile) {
        this.selectedMove = tile;
        this.selectedMove.oldColor = this.selectedMove.style.fill;
        this.selectedMove.style.fill = "yellow";
    },

    deselectMoveTile: function(tile) {
        this.selectedMove.style.fill = this.selectedMove.oldColor;
        this.selectedMove = undefined;
    },

    addXs: function() {
        this.stoneOptionXs = [];
        const boardPixelWidth = this.graphics.getAttributeNS(null, "width");
        const boardPixelHeight = this.graphics.getAttributeNS(null, "height");
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        var maxCircleWidth = (boardPixelWidth - 10) / width;
        var maxCircleHeight = (boardPixelHeight - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        const boxSide = maxDiameter;
        //const boxSide = boardPixelWidth / width;
        var svgNS = "http://www.w3.org/2000/svg";
        //console.log("boardPixelSize: " + boardPixelSize);
        const amazonLoc = [this.selectedTile.box.column, this.selectedTile.box.row];
        const locations = this.position.movableTiles(amazonLoc, board);

        for (var i = 0; i < locations.length; i++) {
            const location = locations[i];

        }
    },

    getNextPositionFromClick: function(event, currentPlayer, containerElement) {
        var clickedTile = event.target.box;
        // Determine the Amazon the player wants to move
        if (this.selectedTile === undefined) {
            //console.log("First case!");
            const text = clickedTile.text;
            const amazonPlayer = clickedTile.color == "blue" ? 0 : 1;
            if (text == "A" && amazonPlayer == currentPlayer) {
                this.selectTile(clickedTile);
            }
            return null;
        }
        // Determine where the player wants to move the Amazon
        else if (this.selectedMove === undefined) {
            const text = clickedTile.text;
            const amazonLoc = [this.selectedTile.column, this.selectedTile.row];
            const selectedMoveTile = [clickedTile.column, clickedTile.row];

            const board = this.position.getBoard();
            
            const possibleMovements = this.position.movableTiles(amazonLoc, board);
            
            var flag = false;
            for(var i = 0; i < possibleMovements.length; i++) {
                const possibleMove = possibleMovements[i];

                if (text != "A" && text != "stone" && this.position.coordinatesEquals(selectedMoveTile, possibleMove)) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                this.selectMoveTile(clickedTile);
            }
        }
        // Determine which tile the Amazon should destroy
        else {
            const text = clickedTile.text;
            const newAmazonLoc = [this.selectedMove.column, this.selectedMove.row];
            const destroyedTile = [clickedTile.column, clickedTile.row];

            const board = this.position.getBoard();

            possibleTiles = this.position.movableTiles(newAmazonLoc, board);

            for (var i = 0; i < possibleTiles.length; i++) {
                const possibleTile = possibleTiles[i];

                if (text != "A" && text != "stone" && this.position.coordinatesEquals(destroyedTile, possibleTile)) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                const amazonTile = [this.selectedTile.column, this.selectedTile.row];
                const moveTile = [this.selectedMove.column, this.selectedMove.row];

                const option = this.position.getOptionFromMove(amazonTile, moveTile, destroyedTile);

                this.deselectTile();
                this.deselectMoveTile();
                return option;
            }
        }
    }
});

/**
 * View Factory for Amazons
 */
var InteractiveAmazonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function() {
    },

    /**
     * Returns an interactive view
     */
    getInteractiveBoard: function(position) {
        return new InteractiveAmazonsView(position);
    },

    /**
     * Returns a view.
     */
    getView: function(position) {
        return this.getInteractiveBoard(position);
    },

}); //end of InteractiveAmazonsViewFactory

function newAmazonsGame() {
    var viewFactory = new InteractiveAmazonsViewFactory();
    var playDelay = 1000;
    var playerOptions = getCommonPlayerOptions(viewFactory, playDelay, 1, 5);
    var size = 10;
    var numBlueAmazons = 4;
    var numRedAmazons = 4;
    var controlForm = $('gameOptions');
    var leftPlayer = parseInt(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer =  parseInt(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var game = new Amazons(size, numBlueAmazons, numRedAmazons);
    var players = [playerOptions[leftPlayer], playerOptions[rightPlayer]];
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};
