// Players and game state
const players = [
    { name: "Spongebob (You)", dice: [], isHuman: true },
    { name: "Davy Jones", dice: [], isHuman: false },
    { name: "Jack Sparrow", dice: [], isHuman: false },
    { name: "William Turner", dice: [], isHuman: false },
    { name: "Elizabeth Swann", dice: [], isHuman: false }
];

let currentBid = null;
let currentPlayerIndex = 0;

// Initialize the game
function startGame() {
    players.forEach(player => (player.dice = rollDice(5)));
    updateDisplay();
}

// Roll dice for a player
function rollDice(numDice) {
    return Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6));
}

// Update the game display
function updateDisplay() {
    // Update human player's dice
    const humanDiceDiv = document.getElementById("human-dice");
    humanDiceDiv.innerHTML = players[0].dice
        .map(die => createDiceHTML(die))
        .join("");

    // Update dice count for each player
    players.forEach((player, index) => {
        const playerDiv = document.getElementById(`player-${index + 1}`);
        const diceCount = player.dice.length;
        const diceCountElement = playerDiv.querySelector(".dice-count");

        if (diceCountElement) {
            diceCountElement.textContent = `${diceCount} dice`;
        } else {
            const newDiceCountElement = document.createElement("p");
            newDiceCountElement.className = "dice-count";
            newDiceCountElement.textContent = `${diceCount} dice`;
            playerDiv.appendChild(newDiceCountElement);
        }
    });

    // Update the status
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = currentBid
        ? `Current Bid: ${currentBid.quantity} of ${currentBid.face}s`
        : "No bid yet.";
}

// Helper function to create dice HTML with dots
function createDiceHTML(value) {
    const dotPositions = [
        [], // No dots for 0
        ["center"],
        ["top-left", "bottom-right"],
        ["top-left", "center", "bottom-right"],
        ["top-left", "top-right", "bottom-left", "bottom-right"],
        ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
        ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"]
    ];

    const dots = dotPositions[value]
        .map(position => `<div class="dot ${position}"></div>`)
        .join("");

    return `<div class="dice">${dots}</div>`;
}

// Apply Dice Animation
document.querySelectorAll(".dice").forEach(die => {
    die.style.animation = "shake 0.5s ease-in-out";
});

// Handle human player making a bid
document.getElementById("bid-button").onclick = () => {
    const quantity = parseInt(prompt("Enter the quantity (e.g., 4):"));
    const face = parseInt(prompt("Enter the face (1-6):"));

    if (!isValidBid(quantity, face)) {
        alert("Invalid bid! You must raise the current bid.");
    } else {
        currentBid = { quantity, face };
        nextTurn();
    }
};

// Validate a bid
function isValidBid(quantity, face) {
    if (!currentBid) return true; // First bid is always valid
    return (
        quantity > currentBid.quantity ||
        (quantity === currentBid.quantity && face > currentBid.face)
    );
}

// Handle calling "Liar!"
document.getElementById("liar-button").onclick = () => {
    resolveChallenge();
};

// Resolve a challenge
function resolveChallenge() {
    const totalDice = players
        .flatMap(player => player.dice) // Combine all players' dice
        .filter(die => die === currentBid.face).length; // Count dice matching the bid face

    const challenger = players[currentPlayerIndex];
    if (totalDice >= currentBid.quantity) {
        // The bid was true; the challenger loses a die
        alert(`The bid was true! ${challenger.name} loses a die.`);
        challenger.dice.pop(); // Remove one die from the challenger
    } else {
        // The bid was false; the bidder loses a die
        alert(`The bid was false! The bidder loses a die.`);
        const bidderIndex = (currentPlayerIndex - 1 + players.length) % players.length;
        players[bidderIndex].dice.pop(); // Remove one die from the bidder
    }

    // Re-roll dice for all players
    players.forEach(player => {
        if (player.dice.length > 0) {
            player.dice = rollDice(player.dice.length);
        }
    });

    nextRound(); // Start the next round
}

// Move to the next player
function nextTurn() {
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].dice.length === 0); // Skip players with no dice

    updateDisplay();

    if (!players[currentPlayerIndex].isHuman) {
        aiTurn(players[currentPlayerIndex]);
    }
}

// AI logic for making bids
function aiTurn(player) {
    // Count how many of the bid face the AI knows it has
    const knownDice = player.dice.filter(die => die === currentBid?.face).length;

    // Estimate the total number of dice of the bid face based on probabilities
    const remainingDice = players.reduce((sum, p) => sum + p.dice.length, 0) - player.dice.length;
    const estimatedTotal = knownDice + Math.ceil((remainingDice * 1) / 6); // Assume ~1 in 6 are the target face

    // Decide whether to call "Liar!"
    if (currentBid && currentBid.quantity > estimatedTotal + 2) {
        // If the bid is clearly unreasonable, call "Liar!"
        setTimeout(() => {
            alert(`${player.name} calls "Liar!"`);
            resolveChallenge();
        }, 1000);
        return;
    }

    // Otherwise, raise the bid
    const newBid = {
        quantity: currentBid ? currentBid.quantity + 1 : 1,
        face: currentBid ? currentBid.face : Math.ceil(Math.random() * 6)
    };
    currentBid = newBid;

    setTimeout(() => {
        alert(`${player.name} bids ${currentBid.quantity} of ${currentBid.face}s.`);
        nextTurn();
    }, 1000);
}

// Start a new round
function nextRound() {
    currentBid = null; // Reset the bid for the new round

    // Check if there’s only one player left
    const activePlayers = players.filter(player => player.dice.length > 0);
    if (activePlayers.length === 1) {
        alert(`${activePlayers[0].name} is the winner!`);
        resetGame(); // Reset the game after a winner is determined
        return;
    }

    nextTurn(); // Move to the next player's turn
}

// Reset the game
function resetGame() {
    players.forEach(player => (player.dice = [])); // Clear all players' dice
    currentBid = null;
    currentPlayerIndex = 0;
    startGame(); // Restart the game
}

// Start the game
startGame();