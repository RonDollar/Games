let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const messageElement = document.getElementById("message");

function createBoard() {
    const gameBoard = document.getElementById("game-board");
    boardState.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleCellClick(index));
        gameBoard.appendChild(cell);
    });
}

function handleCellClick(index) {
    if (!boardState[index] && currentPlayer === "X") { // Player's turn
        boardState[index] = currentPlayer;
        document.querySelectorAll(".cell")[index].textContent = currentPlayer;

        if (checkWinner()) {
            messageElement.textContent = `${currentPlayer} wins!`;
            return;
        }

        if (boardState.every(cell => cell)) {
            messageElement.textContent = "It's a draw!";
            return;
        }

        currentPlayer = "O"; // Switch to the computer's turn
        messageElement.textContent = `Current Player: ${currentPlayer}`;
        setTimeout(computerMove, 500); // Add delay for realism
    }
}

function computerMove() {
    // Step 1: Check if the computer can win
    for (let i = 0; i < boardState.length; i++) {
        if (!boardState[i]) {
            boardState[i] = "O"; // Try a move
            if (checkWinner()) {
                document.querySelectorAll(".cell")[i].textContent = "O";
                messageElement.textContent = `${currentPlayer} wins!`;
                return;
            }
            boardState[i] = ""; // Undo move
        }
    }

    // Step 2: Block the player from winning
    for (let i = 0; i < boardState.length; i++) {
        if (!boardState[i]) {
            boardState[i] = "X"; // Simulate player's move
            if (checkWinner()) {
                boardState[i] = "O"; // Block it
                document.querySelectorAll(".cell")[i].textContent = "O";
                currentPlayer = "X"; // Switch back to player
                messageElement.textContent = `Current Player: ${currentPlayer}`;
                return;
            }
            boardState[i] = ""; // Undo move
        }
    }

    // Step 3: Take the center if available
    if (!boardState[4]) {
        boardState[4] = "O";
        document.querySelectorAll(".cell")[4].textContent = "O";
        currentPlayer = "X";
        messageElement.textContent = `Current Player: ${currentPlayer}`;
        return;
    }

    // Step 4: Pick a random empty cell
    let emptyCells = [];
    boardState.forEach((cell, index) => {
        if (!cell) emptyCells.push(index);
    });
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[randomIndex] = "O";
    document.querySelectorAll(".cell")[randomIndex].textContent = "O";

    currentPlayer = "X"; // Switch back to player
    messageElement.textContent = `Current Player: ${currentPlayer}`;
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winningCombos.some(combo =>
        combo.every(index => boardState[index] === currentPlayer)
    );
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    document.querySelectorAll(".cell").forEach(cell => (cell.textContent = ""));
    messageElement.textContent = `Current Player: ${currentPlayer}`;
}

// Initialize the game
createBoard();
resetGame();

/*
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const messageElement = document.getElementById("message");

function createBoard() {
    const gameBoard = document.getElementById("game-board");
    boardState.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleCellClick(index));
        gameBoard.appendChild(cell);
    });
}

function handleCellClick(index) {
    if (!boardState[index]) {
        boardState[index] = currentPlayer;
        document.querySelectorAll(".cell")[index].textContent = currentPlayer;

        if (checkWinner()) {
            messageElement.textContent = `${currentPlayer} wins!`;
            return;
        }
        
        if (boardState.every(cell => cell)) {
            messageElement.textContent = "It's a draw!";
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        messageElement.textContent = `Current Player: ${currentPlayer}`;
    }
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winningCombos.some(combo =>
        combo.every(index => boardState[index] === currentPlayer)
    );
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    document.querySelectorAll(".cell").forEach(cell => (cell.textContent = ""));
    messageElement.textContent = `Current Player: ${currentPlayer}`;
}

// Initialize the game
createBoard();
resetGame();*/