// ==================== UI STATE ====================

// ==================== INITIALIZATION ====================
function initGame(n) {
    const urlParams = new URLSearchParams(window.location.search);
    gameMode = urlParams.get('mode') || 'arcade';

    if (gameMode === 'classic') {
        console.log("🧩 Initializing Classic Mode...");
        // Generate a guaranteed solvable puzzle matrix with pre-filled clues
        matrix = generateClassicPuzzle(n);
        
        // Permanent toolbar: numbers 1 through n (do not spend/deplete them)
        //availNums = [];
        for (let i = 1; i <= n; i++) availNums.push(i);
        
    } else {
        console.log("🎮 Initializing Arcade Mode...");
        // Standard random survival matrix
        matrix = createRandomMatrix(n);
        
        // Rotating consumable batch
        availNums = newAvailNums();
    }

    renderGrid();
    renderCandidates();
}

// Automatically trigger on page load
window.addEventListener('DOMContentLoaded', () => {
    initGame(4);
});

// ==================== DOM RENDERERS ====================
function renderGrid() {
    const gridContainer = document.getElementById('gridBoard');
    gridContainer.innerHTML = '';

    // --- DYNAMIC GRID SIZING ---
    const n = matrix.length;
    gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;

    
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            const cellObj = matrix[r][c];
            const cellEl = document.createElement('div');
            
            // Base class
            let className = `cell ${cellObj.value !== 0 ? 'filled' : ''}`;

            // Apply ice visual classes based on durability
            if (gameMode == 'arcade' && cellObj.value !== 0) {
                if (cellObj.durability === 2) {
                    className += ' hp-2';
                } else if (cellObj.durability >= 3) {
                    className += ' hp-3';
                }
            }

            cellEl.className = className;
            
            if (cellObj.value === 0) {
                cellEl.textContent = '';
                cellEl.addEventListener('click', () => handleCellClick(r, c));
            } else {
                // Display the number
                cellEl.textContent = cellObj.value;

                // Add visual ice/snowflake indicators for durable blocks
                if (cellObj.durability === 2) {
                    const badge = document.createElement('span');
                    badge.className = 'ice-badge';
                    badge.textContent = '❄️'; // Light frost
                    cellEl.appendChild(badge);
                } else if (cellObj.durability >= 3) {
                    const badge = document.createElement('span');
                    badge.className = 'ice-badge';
                    badge.textContent = '🧊'; // Fully frozen ice cube
                    cellEl.appendChild(badge);
                }
            }

            gridContainer.appendChild(cellEl);
        }
    }
}

function renderCandidates() {
    const trayContainer = document.getElementById('candidatesTray');
    trayContainer.innerHTML = '';

    availNums.forEach((num, index) => {
        const btn = document.createElement('button');
        
        // Added `num === 0` here so it recognizes used slots!
        if (num === null || num === undefined || num === 0) {
            btn.className = 'candidate-btn empty-slot';
            btn.textContent = '-';
            btn.disabled = true;
        } else {
            btn.className = `candidate-btn ${selectedCandidateIndex === index ? 'selected' : ''}`;
            btn.textContent = num;
            btn.addEventListener('click', () => handleCandidateSelect(index));
        }

        trayContainer.appendChild(btn);
    });
}

// ==================== EVENT HANDLERS ====================
function handleCellClick(r, c) {
    if (selectedCandidateIndex === null) {
        setStatus("Please select a candidate number first!");
        return;
    }

    const chosenNum = availNums[selectedCandidateIndex];
    const inputChoice = [chosenNum, r, c];

    // Call engine function (returns matrix on success, or undefined/falsy on failure)
    const resultMatrix = UserInput(inputChoice, availNums);

    // If UserInput returned the matrix, the move was successful!
    if (resultMatrix) {
        selectedCandidateIndex = null;
        renderGrid();
        renderCandidates();

        // Check if the tray got refilled (every item is 0 or fresh pool generated)
        if (availNums.every(item => item === 0)) {
            setStatus("Cleared choices! Generated new candidate numbers.", true);
        } else {
            setStatus("Valid move!", true);
        }
    } else {
        setStatus("Illegal move or number not available.");
    }
}

function handleCellClick(r, c) {
    if (selectedCandidateIndex === null) {
        setStatus("Please select a candidate number first!");
        return;
    }

    const chosenNum = availNums[selectedCandidateIndex];
    const inputChoice = [chosenNum, r, c];

    // Call engine function
    const resultMatrix = UserInput(inputChoice, availNums);

    if (resultMatrix) {
        // Successful move
        selectedCandidateIndex = null;
        renderGrid();
        renderCandidates();

        if (availNums.every(item => item === 0)) {
            setStatus("Cleared choices! Generated new candidate numbers.", true);
        } else {
            setStatus("Valid move!", true);
        }
    } else {
        // Failed move: Now the UI will actually tell you why!
        setStatus("Illegal move! Cell conflicts with row/column.");
    }
}

function setStatus(msg, isSuccess = false) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = msg;
    statusEl.className = `status-message ${isSuccess ? 'success' : ''}`;
}



// ==================== EVENT HANDLERS ====================
function handleCandidateSelect(index) {
    if (availNums[index] === null || availNums[index] === undefined || availNums[index] === 0) return;
    selectedCandidateIndex = index;
    renderCandidates();
    setStatus(`Selected number ${availNums[index]}. Now tap an empty cell.`, true);
}

// ==================== GAME OVER'S ====================
function showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function restartGame() {
    // Reset matrix back to initial state (or a fresh blank/preset state)
    matrix = createRandomMatrix(4)
    turnCounter = 0;

    // Hide modal
    const modal = document.getElementById('gameOverModal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Re-initialize game
    initGame();
}
// Start game on load
window.onload = initGame;
