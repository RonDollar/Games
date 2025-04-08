const boardSize = 20; // New grid size: 20x20
const mineCount = 80; // Adjust number of mines for a larger board
let board = [];
let minePositions = [];

function createBoard() {
    const gameBoard = document.getElementById("game-board");
    board = [];
    minePositions = [];

    // Clear previous board
    gameBoard.innerHTML = "";

    // Generate board and cells
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-col", col);
            cell.addEventListener("click", () => handleCellClick(row, col));
            gameBoard.appendChild(cell);
            board[row][col] = {
                revealed: false,
                mine: false,
                adjacentMines: 0,
            };
        }
    }

    // Place mines
    placeMines();
}

function placeMines() {
    while (minePositions.length < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const position = `${row},${col}`;

        if (!minePositions.includes(position)) {
            minePositions.push(position);
            board[row][col].mine = true;
        }
    }

    // Calculate adjacent mine counts
    minePositions.forEach(pos => {
        const [row, col] = pos.split(",").map(Number);
        updateAdjacentCells(row, col);
    });
}

function updateAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
            newRow >= 0 && newRow < boardSize &&
            newCol >= 0 && newCol < boardSize
        ) {
            board[newRow][newCol].adjacentMines++;
        }
    });
}

function handleCellClick(row, col) {
    const cell = board[row][col];

    if (cell.revealed) return; // Ignore already revealed cells

    cell.revealed = true;
    const htmlCell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );

    if (cell.mine) {
        htmlCell.textContent = "💣";
        htmlCell.style.backgroundColor = "red";
        endGame(false); // Game over
    } else {
        htmlCell.textContent = cell.adjacentMines || "";
        htmlCell.classList.add("revealed");
        if (cell.adjacentMines === 0) {
            revealAdjacentCells(row, col);
        }
    }

    checkWin();
}

function revealAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
            newRow >= 0 && newRow < boardSize &&
            newCol >= 0 && newCol < boardSize &&
            !board[newRow][newCol].revealed &&
            !board[newRow][newCol].mine
        ) {
            handleCellClick(newRow, newCol);
        }
    });
}

function checkWin() {
    const allCellsRevealed = board.flat().every(
        cell => cell.revealed || cell.mine
    );

    if (allCellsRevealed) {
        endGame(true); // Player wins
    }
}

function endGame(win) {
    const message = win ? "Congratulations, you win!" : "Game over! You hit a mine.";
    alert(message);
    resetGame();
}

function resetGame() {
    createBoard();
}

// Initialize the game
createBoard();