// this file controls game flow, puzzle logic, user interaction

const puzzles = [       // PUZZLE DB
    {                                         // store all puzzles in an array so its easy to add more levels
        level: 1,
        title: "The Encrypted Message",
        description: `You've intercepted an encrypted message. The code reads: "IFMMP XPSME"
                     <br><br>
                     Hint: Each letter has been shifted by 1 position in the alphabet.
                     <br><br>
                     What is the decoded message?`,
        answer: "HELLO WORLD"
    },
    {
        level: 2,
        title: "The Binary Code",
        description: `A mysterious binary sequence has appeared: "01001000 01001001"
                     <br><br>
                     Hint: Binary can be converted to text. Each 8-digit group represents one letter.
                     <br><br>
                     What does it say?`,
        answer: "HI"
    },
];

// GAME STATE
// track which level the player is currently on
let currentLevel = 0;

// wrapped inside a DOMContentLoaded event ensures page elements load before accessing elements, preventing runtime errors
document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const gameSection = document.getElementById('gameSection');
    const successScreen = document.getElementById('successScreen');
    const startButton = document.getElementById('startButton');
    const submitButton = document.getElementById('submitButton');
    const puzzleInput = document.getElementById('puzzleInput');
    const restartButton = document.getElementById('restartButton');
    const feedbackBox = document.getElementById('feedbackBox');
    const progressDisplay = document.getElementById('progressDisplay');
    const puzzleTitle = document.getElementById('puzzleTitle');
    const puzzleDescription = document.getElementById('puzzleDescription');

    // if any required element does not exist, stop script to prevent page from crash
    if (!startButton || !submitButton || !puzzleInput) {
        return;
    }

    // load a puzzle onto the screen
    function loadPuzzle(levelIndex) {
        const puzzle = puzzles[levelIndex];

        // update puzzle content on screen
        puzzleTitle.textContent = `Puzzle #${puzzle.level}: ${puzzle.title}`;
        puzzleDescription.innerHTML = puzzle.description;

        // update progress indicator
        progressDisplay.textContent = `Level ${puzzle.level} of ${puzzles.length}`;

        // clear input box and feedback for fresh start
        puzzleInput.value = '';
        feedbackBox.textContent = '';
        feedbackBox.className = 'feedback-box'; // reset any success/error styling
    }

    // show terminal-style feedback
    function showFeedback(message, isSuccess) {
        feedbackBox.textContent = message;

        // add different styling based on success or failure
        if (isSuccess) {
            feedbackBox.className = 'feedback-box feedback-success';
        } else {
            feedbackBox.className = 'feedback-box feedback-error';
        }

        // auto-fade effect
        setTimeout(() => {
            feedbackBox.style.opacity = '0';
        }, 3000);

        // reset opacity for next message
        setTimeout(() => {
            feedbackBox.style.opacity = '1';
        }, 3500);
    }

    // EVENT: start game button
    startButton.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';   // hide welcome screen
        gameSection.style.display = 'block';    // show game section
        loadPuzzle(currentLevel);
    });

    // EVENT: submit answer button
    submitButton.addEventListener('click', () => {
        // get user's input and convert to uppercase for case-insensitive comparison
        const answer = puzzleInput.value.trim().toUpperCase();
        const correctAnswer = puzzles[currentLevel].answer;

        // check if answer is correct
        if (answer === correctAnswer) {
            showFeedback('✓ ACCESS GRANTED. Loading next level...', true);

            // wait before moving to next level (gives user time to read feedback)
            setTimeout(() => {
                currentLevel++; // Move to next level

                // check if there are more puzzles
                if (currentLevel < puzzles.length) {
                    loadPuzzle(currentLevel);   // Load next puzzle
                } else {
                    // all puzzles completed - show success screen
                    gameSection.style.display = 'none';
                    successScreen.style.display = 'block';
                }
            }, 1500);

        } else {
            showFeedback('✗ ACCESS DENIED. Reattempt required...', false);
        }
    });

    // EVENT: restart game button
    restartButton.addEventListener('click', () => {
        currentLevel = 0;
        successScreen.style.display = 'none';
        welcomeScreen.style.display = 'block';
    });

    // EVENT: press Enter to submit
    puzzleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
});