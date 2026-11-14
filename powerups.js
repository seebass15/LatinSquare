//-----------Undos and power ups---------------
let playerState = {
    undos: parseInt(localStorage.getItem('latinSquareUndos')) || 3,
    powerups: parseInt(localStorage.getItem('latinSquarePowerups')) || 1
};

// Save inventory changes to localStorage and update HUD if present
function savePlayerState() {
    localStorage.setItem('latinSquareUndos', playerState.undos);
    localStorage.setItem('latinSquarePowerups', playerState.powerups);
    //updatePowerupHUD();
}



// 1. Call this right after a valid user input is successfully placed
function matrixTracker() {
    // Snapshot both the current matrix and the current tray state
    const matrixSnapshot = matrix.map(row => row.map(cell => ({ ...cell })));

    let snapshot = {matrix: matrixSnapshot};
    
    if (gameMode == 'arcade'){
        const traySnapshot = [...availNum];
        snapshot.availNum = traySnapshot;
    }

    moveHistory.push(snapshot);
}

// 2. Call this when the user clicks the Undo button
function undoMove() {
    // Arcade mode inventory check (Classic mode can skip this check)
    if (gameMode === 'arcade') {
        if (playerState.undos <= 0) {
            alert("Out of undos! Watch a quick ad to get more.");
            showAdModal(); // We'll hook this up to ads.js when we return to ads!
            return;
        }
    }

    // Check if there is actually a move history to step back into
    if (moveHistory.length === 0) {
        console.log("No moves to undo!");
        return;
    }

    
    // Pop the most recent snapshot off the stack (-1 equivalent in JS stack pop)
    const previousState = moveHistory.pop();
console.log('HELLLO'+ matrix)
    // Restore matrix and tray variables
    matrix = previousState.matrix;
    
    if(gameMode == 'arcade' && previousState.availNum){
        availNum = previousState.availNum;
    }
    
    // Deduct undo charge and update storage if in Arcade mode
    if (gameMode === 'arcade') {
        playerState.undos--;
        savePlayerState(); // Updates localStorage and HUD counters
    }

    // Re-render the UI elements to reflect the rollback
    renderGrid();
    renderCandidates();
    //renderBoard();
    //renderTray();
    
    console.log("↩️ Undo successful. History stack length:", moveHistory.length);
}
