const wordList = ["javascript", "python", "html", "css", "programming", "developer", "frontend", "backend", "algorithm"];
let word;
let guessedWord;
let attempts;
let wrongGuesses;
const guessedLetters = new Set();

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

// Draw the hangman post
function drawHangmanPost() {
    ctx.fillRect(40, 180, 120, 10); // Ground
    ctx.fillRect(90, 40, 10, 140); // Pole
    ctx.fillRect(90, 40, 70, 10); // Crossbar
    ctx.fillRect(150, 50, 5, 20); // Rope
}

// Draw parts of the hangman figure
function drawHangmanPart(stage) {
    switch (stage) {
        case 1: // Head
            ctx.beginPath();
            ctx.arc(152, 80, 10, 0, 2 * Math.PI);
            ctx.stroke();
            break;
        case 2: // Body
            ctx.fillRect(150, 90, 5, 40);
            break;
        case 3: // Left Arm
            ctx.beginPath();
            ctx.moveTo(150, 90);
            ctx.lineTo(130, 110);
            ctx.stroke();
            break;
        case 4: // Right Arm
            ctx.beginPath();
            ctx.moveTo(150, 90);
            ctx.lineTo(170, 110);
            ctx.stroke();
            break;
        case 5: // Left Leg
            ctx.beginPath();
            ctx.moveTo(150, 130);
            ctx.lineTo(130, 150);
            ctx.stroke();
            break;
        case 6: // Right Leg
            ctx.beginPath();
            ctx.moveTo(150, 130);
            ctx.lineTo(170, 150);
            ctx.stroke();
            break;
    }
}

// Reset and restart the game
function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawHangmanPost(); // Redraw the post

    // Reset variables
    const randomIndex = Math.floor(Math.random() * wordList.length);
    word = wordList[randomIndex];
    guessedWord = "_".repeat(word.length);
    attempts = 6;
    wrongGuesses = 0;
    guessedLetters.clear();

    // Update UI
    document.getElementById("word").innerText = guessedWord;
    document.getElementById("message").innerText = "";
}

// Handle guesses
function makeGuess() {
    const guessInput = document.getElementById("guess");
    const guess = guessInput.value.toLowerCase();
    guessInput.value = ""; // Clear input field

    if (guessedLetters.has(guess)) {
        document.getElementById("message").innerText = `You've already guessed '${guess}'. Try again!`;
        return;
    }

    guessedLetters.add(guess);

    if (word.includes(guess)) {
        let updatedWord = "";
        for (let i = 0; i < word.length; i++) {
            updatedWord += word[i] === guess ? guess : guessedWord[i];
        }
        guessedWord = updatedWord;
        document.getElementById("word").innerText = guessedWord;

        if (!guessedWord.includes("_")) {
            document.getElementById("message").innerText = "Congratulations! You guessed the word!";
            setTimeout(resetGame, 3000); // Restart after 3 seconds
        }
    } else {
        wrongGuesses++;
        drawHangmanPart(wrongGuesses);
        attempts--;
        document.getElementById("message").innerText = `Wrong guess! Attempts left: ${attempts}`;

        if (attempts === 0) {
            document.getElementById("message").innerText = `Game over! The word was "${word}".`;
            setTimeout(resetGame, 3000); // Restart after 3 seconds
        }
    }
}

// Start the first game
resetGame();