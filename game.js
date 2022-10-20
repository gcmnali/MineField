// Set this constant to true to debug the placement of bombs without
// having to click on all cells to reveal them.
const CHEAT_REVEAL_ALL = false;

const ROWS_COUNT = 10;
const COLS_COUNT = 10;
const BOMBS_COUNT = 20;

var defeat = false;
var victory = false;

// Cell constructor
function Cell()
{
    this.discovered = false;
    this.isBomb = false;
    this.hasBeenFlagged = false;
    this.countAdjacentBombs = 0;
}

// Initialize cells
var cells = Array(ROWS_COUNT);
for (var row = 0; row < ROWS_COUNT; row++) {
    cells[row] = Array(COLS_COUNT);
    for (var col = 0; col < COLS_COUNT; col++) {
        cells[row][col] = new Cell();
    }
}

//
// TODO: Task 1 - add some bombs at fixed positions.
//
let randomBombPlaces = new Array(BOMBS_COUNT);
for(let i = 0; i<BOMBS_COUNT;i++){
    let r = -1;
    let x = 0;
    let y = 0;

    do{
        r = parseInt(Math.random() * 100);
        x = parseInt(r / COLS_COUNT);
        y = parseInt(r % ROWS_COUNT);
    }
    while(cells[x][y].isBomb)
    
    cells[x][y].isBomb = true;
    randomBombPlaces.push(r);
}

//
// TODO: Task 2 - Comment out the code of task 1. Instead of adding bombs in fixed places, add 10 of them in random places.
//                Add a BOMBS_COUNT constant so that you can easily change the amount of bombs placed. Put it next to the
//                other constants.
//
// ALREADY DONE - SORRY NOT TO FIX THE POSITIONS

// Once the game has been initialized, we "render" it.
render();


//
// Game functions definitions
//
function discoverCell(row, col, userClickedOrNot=true) {
    //
    // TODO: Task 5 - Reveal cells when clicked.
    //
    if(cells[row][col].discovered)
        return;
        
    cells[row][col].discovered = true;
    //
    // TODO: Task 6 - Discover neighbor cells recursively, as long as there are no adjacent bombs to the current cell.
    //

    let x1 = row == 0 ? 0 : row - 1;
    let x2 = row == 9 ? 9 : row + 1;
    let y1 = col == 0 ? 0 : col - 1;
    let y2 = col == 9 ? 9 : col + 1;
    
    if(!cells[row][col].isBomb){
        for(let i = x1; i <= x2; i++ ){
            for(let j = y1; j <= y2; j++ ){
                if(i== row && j == col)
                    continue;

                if(!cells[i][j].isBomb){
                    if(cells[i][j].countAdjacentBombs == 0)
                        discoverCell(i,j,false);

                    cells[i][j].discovered = true;
                }
                else
                    return;
            }    
        }
    }
    else if(userClickedOrNot){
        defeat = true;
    }
    
    render();

    //
    // TODO: Task 8 - Implement defeat. If the player "discovers" a bomb (clicks on it without holding shift), set the variable defeat to true.
    //
}

function flagCell(row, col) {
    //
    // TODO: Task 7 - Implement flags. Flags allow the player to mark cells that they think contain a bomb.
    //                When clicking a cell and holding shift, function flagCell() will be called for you.
    //
    cells[row][col].hasBeenFlagged = true;
    render();
}

// This function is called once for each cell when rendering the game. The row and col of the current cell is
// passed to the functionn
function countAdjacentBombs(row, col) {
    //
    // TODO: Task 4 - Adjacent bombs are bombs in cells touching our cell (also diagonally). Implement this function
    //                so that it returns the count of adjacent cells with bombs in them. 
    //
    let ret = 0;
    let x1 = row == 0 ? 0 : row - 1;
    let x2 = row == 9 ? 9 : row + 1;
    let y1 = col == 0 ? 0 : col - 1;
    let y2 = col == 9 ? 9 : col + 1;
    
    for(let i = x1; i <= x2; i++ ){
        for(let j = y1; j <= y2; j++ ){
            if(i== row && j == col)
                continue;

            if(cells[i][j].isBomb) ret++;
        }    
    }

    cells[row][col].countAdjacentBombs = ret;
    return ret;
}

function getBombsCount() {
    //
    // TODO: Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    //
    return BOMBS_COUNT;
}

function getClearedCells() {
    //
    // TODO: Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    //
    let count = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(cells[i][j].discovered) count++;
        }    
    }
    return count;
}

function getTotalCellsToClear() {
    //
    // TODO: Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    //
    return 100;
}

function checkForVictory() {
    //
    // TODO: Task 10 - Implement victory. If the player has revealed as many cells as they must (every cell that isn't a
    //                 bomb), set variable victory to true.
    //

    victory = getClearedCells()+BOMBS_COUNT == 100;
    return victory;
}

//
// Rendering functions
//
function getMessage() {
    if (victory == true) {
        return "Well done! 👏🏼<br><br>Refresh the page to start again.";
    } else if (defeat) {
        return "Boom! 💥<br><br>Refresh the page to try again.";
    }
    return "";
}

// "Render" the game. Update the content of the page to reflect any changes to the game state.
function render() {
    var playfield = document.getElementById("playfield");
    var html = "";
    for (var row = 0; row < ROWS_COUNT; row++) {
        html += '<div class="row">';
        for (var col = 0; col < COLS_COUNT; col++) {
            var cell = cells[row][col];
            var cellText = "";
            var cssClass = "";
            var textColor = "";
            if (cell.discovered || CHEAT_REVEAL_ALL || defeat) {
                cssClass = "discovered";
                if (cell.isBomb) {
                    cellText = "💣";
                } else {
                    var adjBombs = countAdjacentBombs(row, col);
                    if (adjBombs > 0) { 
                        cellText = adjBombs.toString();
                        if (adjBombs == 1) {
                            textColor = "blue";
                        } else if (adjBombs == 2) {
                            textColor = "green";
                        } else if (adjBombs == 3) {
                            textColor = "red";
                        } else if (adjBombs == 4) {
                            textColor = "black";
                        }
                    }
                }
            } else {
                if (cell.hasBeenFlagged) {
                    cellText = "🚩"
                }
            }
            html += `<div class="cell ${cssClass}" style="color:${textColor}" onclick="onCellClicked(${row}, ${col}, event)">${cellText}</div>`;
        }
        html += "</div>"
    }
    playfield.innerHTML = html;

    // Defeat screen
    var body = document.getElementsByTagName("body")[0];
    if (defeat) {
        body.classList.add("defeat")
    }

    // Victory screen
    if (victory) {
        body.classList.add("victory")
    }

    // Update stats
    document.getElementById("bombs-count").innerText = getBombsCount().toString();
    document.getElementById("cleared-cells-count").innerText = getClearedCells().toString();
    document.getElementById("total-cells-to-clear").innerText = getTotalCellsToClear().toString();

    // Update message
    document.getElementById("message").innerHTML = getMessage();
}

// This function gets called each time a cell is clicked. Arguments "row" and "col" will be set to the relevant
// values. Argument "event" is used to check if the shift key was held during the click.
function onCellClicked(row, col, event) {
    if(event.shiftKey) {
        flagCell(row, col);
    } else {
        discoverCell(row, col);
    }
    checkForVictory();
    render();
}