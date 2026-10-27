let gameMode = 'arcade'; // Can be 'arcade' or 'classic'

//check with previous version to see if clear row and celar col were actually working
let matrix=createRandomMatrix(4);

// At startup in latinsquare.js:
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'classic') {
    gameMode = 'classic';
    console.log('CLASSIC MODE');
    // Set classic-specific rules (e.g., make all 1-to-N candidates available)
    availNum = [];
    for (let i = 1; i <= matrix.length; i++) availNum.push(i);
}else{console.log('ARCADE MODE');}

//inilize game
console.log('GAME START');
console.log(matrix);

let turnCounter = 0;
//let availNums = newAvailNums();

let inputChoice = [,,];


function createRandomMatrix(n){
    let mat = [];
    for(r=0;r<n;r++){
        let myRow = [];
        for(c=0;c<n;c++){
            myRow.push({value:0,durability:1,turnsAlive:0})
        }
        mat.push(myRow)
    }
    initDiff = Math.floor((n**2)/3);//a fixed value for now to piock hpow many cells to fill
    let indexer = 0;
    let attempt = 0;
    let maxAttempts = 200;
//console.log(initDiff)
    while(indexer<initDiff && attempt<maxAttempts){
        attempt++
//console.log(indexer)
        let yPos = Math.floor(Math.random()*n);
        let xPos = Math.floor(Math.random()*n);
        let myVal = Math.floor(Math.random()*n)+1;


//console.log('value '+myVal+' cellCord '+yPos+' '+xPos)
//console.log('matrix '+mat[yPos])
        if(mat[yPos][xPos].value==0){
            nRow = mat[yPos].some(cell=>cell.value ==myVal);
            columnArray = mat.map(myCol=>myCol[xPos]);
            nCol = columnArray.some(cell => cell.value ==myVal);
//console.log(mat[yPos].some(cell=>cell.value))
            if(!nCol && !nRow){
                mat[yPos][xPos].value = (myVal);
                indexer++;
            }else{console.log('generating the matrix had to rety for a number')}

        }
    }
    return(mat);
}

//function for user input
function UserInput(inputChoice,availNum){
    myInput = Number(inputChoice[0])
    yPos = inputChoice[1];
    xPos = inputChoice[2];
    let cellCord = yPos+'-'+xPos;
    let moveSucess = false;

    if(availNum.includes(myInput)){
        //get all legal moves
        let legalMovesMap1 = get_legal_moves(matrix);//might need to be local
        let numCheck = legalMovesMap1.get(cellCord);
//console.log(legalMovesMap1.get(cellCord));
//console.log('this is the row were looking at '+matrix[yPos]+' this is the cell '+matrix[yPos][xPos]+' numCheck '+numCheck+' the cell cords '+cellCord)

        if(gameMode=='arcade'){
            console.log('ARCADE MODE');
            if(numCheck.includes(myInput)){
//console.log('allowed move'+numCheck+' my number '+availNum)
            matrix[yPos][xPos].value= myInput;
//console.log(matrix);
            myIndex = availNum.indexOf(myInput);
            availNum[myIndex]= 0;

            clearChecker(xPos,yPos);


            if(availNum.every(item=>item==0)){
                console.log('choices are empty');
                availNum.length = 0;
                newNums = newAvailNums();
                availNum.push(...newNums);
            }else{
                console.log(availNum)
            }

            moveSucess = true;
        }else{
            console.log('illegal move or number already there silly')
        }
            }else if (gameMode === 'classic') {
        // Classic features: check if the whole grid is filled to win!
        checkClassicWinCondition();
    }
    }else{
        console.log('SORRY THAT NUMBER IS NOT AVAILABLE PLEASE TRY AGAIN')
    }

    //game over check
    console.log(availNum);
    if(moveSucess){
        turnCounter++;
        console.log('turns '+turnCounter);

        cellTurnCounter();
        if(turnCounter>=20 && turnCounter<50){//need to think of a way to NOT HARD CODE THIS
            shouldHarden(10);
        }else if(turnCounter>=50 && turnCounter<90){
            shouldHarden(5);
        }else if(turnCounter>=90){
            shouldHarden(3); 
        }   
        
        if(checkGameOver(get_legal_moves(matrix),availNum)){//check if nums or num
            if(typeof showGameOverModal == 'function'){showGameOverModal()}
        }
        return(matrix)
    }  
    return null;
}


function newAvailNums(){//NEED TO FIX TO ENSURE POSSIBLE MOVES
    console.log('AVAILABLE NUMBERS');
    let maxAttempts =100;
    let attempt=0;
    let availCand = [];
    let newNums = [];
    while(availCand.length<matrix[0].length && maxAttempts>attempt){//was a for loop up to 3
        attempt++;
        let randInt = Math.floor(Math.random()*matrix[0].length)+1;
        let matValues = matrix.flat().map(cell=>cell.value);
        let getCount1 = matValues.filter(num => num==randInt).length;
        let newCount = (availCand.flat().filter(num=>num==randInt).length);
        let totalCount = getCount1+newCount;
//console.log(' new random number: '+randInt+' picked so far '+availCand+' count within matrix '+getCount1+' count picked '+newCount+' get the count of X '+totalCount);

        if(totalCount<matrix[0].length){
            availCand.push(randInt);
            attempt=0;
        }else if (attempt >= maxAttempts) {
            console.log('Safety net triggered: force pushing ' + randInt);
            availCand.push(randInt);
            attempt=0;
        }
    }
console.log(availCand);
    return(availCand);
}



function clearChecker(coln,rown){
    
    let boolCheckr = !matrix[rown].some(cell=>cell.value == 0);
    let columnArray = matrix.map(myCol => myCol[coln]);
    let boolCheckc = !columnArray.some(cell=>cell.value == 0);
//console.log('rows '+boolCheckr);
//console.log('cols '+boolCheckc);

    //rows
    /*if(matrix[rown].includes(0)){
        boolCheckr = true;
        console.log('still good here row')
    }
    else{
        boolCheckr=false;
        console.log('CLEAR THE ROW ADD SOME POINTS')
    }

    //columns
    let columnArray = matrix.map(myCol => myCol[coln]);
    if (columnArray.includes(0)) {
        boolCheckc = true;
        console.log('still good here column');
    } else {
        boolCheckc = false;
        console.log('CLEAR THE column ADD SOME POINTS');
    }*/

    if(boolCheckc){
        console.log('CLEAR THE column ADD SOME POINTS');
        
        
            
        for(r=0;r<matrix[0].length;r++){
            matrix[r][coln].durability -=1;
            if(matrix[r][coln].durability<=0){
                matrix[r][coln]= { value: 0, durability: 1,turnsAlive:0 };
            }
        }
       //matrix.map(myCol=>myCol[coln]) = columnArray.fill(0);
    }
    if(boolCheckr){
        console.log('CLEAR THE ROW ADD SOME POINTS')
        
        for (let c = 0; c < matrix[rown].length; c++) {
            // Reduce durability for this cell
            matrix[rown][c].durability -= 1;
            
            // If durability hits 0 or below, clear the cell back to 0
            if (matrix[rown][c].durability <= 0) {
                matrix[rown][c] = { value: 0, durability: 1,turnsAlive:0 };
            }
        }
    }

}



function checkGameOver(legalMovesMap, availNum) {
    let hasEmptyCells = false;
    let canPlayAnyCandidate = false;

    // 1. Check if there are any empty cells left on the board
    for (let r = 0; r < matrix[0].length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c].value === 0) {
                hasEmptyCells = true;
                let cellKey = r + "-" + c;
                let validMovesForCell = legalMovesMap.get(cellKey) || [];
//console.log(legalMovesMap)
//console.log(availNum)
                // 2. Check if any active (non-zero) candidate in your tray can fit into this cell
                for (let num of availNum) {
                    if (num !== 0 && validMovesForCell.includes(num)) {
                        canPlayAnyCandidate = true;
                        break;
                    }
                }
            }
            if (canPlayAnyCandidate) {break;}
        }
        if (canPlayAnyCandidate || !hasEmptyCells) {break;}
    }

    // If there are empty cells left, but ZERO candidates can fit anywhere -> GAME OVER!
    if (hasEmptyCells && !canPlayAnyCandidate) {
        console.log("GAME OVER: Soft-locked! No moves left for current candidates.");
        return true;
    }

    return false;
}

function cellTurnCounter(){
    for(r=0;r<matrix[0].length;r++){
        for(c=0;c<matrix[0].length;c++){
            if(matrix[r][c].value != 0){
                matrix[r][c].turnsAlive +=1;
                console.log('life alive for '+matrix[r][c].turnsAlive)
            }
        }
    }      
}

function shouldHarden(n,freq){//NEED TO THINK OF A WAY TO NOT HARD CODE THIS
    for(r=0;r<matrix[0].length;r++){
        for(c=0;c<matrix[0].length;c++){
            if(matrix[r][c].value != 0 && matrix[r][c].turnsAlive%n==0){
                matrix[r][c].durability +=1;
                console.log('items life '+matrix[r][c].durability)
            }
        }
    }
}


function get_legal_moves(matrix){//might need to move below nRows etc.
    //generating allowed numbers(should be able to do this without for loop
    allowedNumbers = [];
    for(i=1;i<matrix[0].length+1;i++){
        allowedNumbers.push(i);    
    }

    //gridSize = matrix.gridSize;
    const legalMovesMap = new Map();
    nRows = [];
    nCols = [];
//console.log('nRows post: '+matrix)

    //populates empty matrices. IS THIS NECESSARY
    for( i=0;i<matrix[0].length;i++){
        nRows.push([]);
        nCols.push([]);
    }

//console.log('nRows post2: '+nRows)           
    //fill in the nRows and nCols with non-zero values out(nRow goes in a zig-zag. nCol goes top down per col)
    for(x = 0;x<matrix[0].length;x++){
        for(y=0;y<matrix[0].length;y++){
            cellValue = matrix[x][y].value;

            if(cellValue !== 0){
                nRows[x].push(cellValue);
                nCols[y].push(cellValue);
            }
            //console.log('nRow Checker: '+nRows)
            //console.log('nCol Checker: '+nCols)
        }
    }
//console.log('ROWS FULL '+nRows+' VALUE 1: '+nRows[1])
    //
    for(r = 0;r<matrix[0].length;r++){
        for(c = 0;c<matrix[0].length;c++){
            currentCellValue = matrix[r][c].value;
            let cellCordKey = r+"-"+c;
//console.log('getting all coordinate pos.: '+cellCordKey)
            //if cell already filled move on
            if(currentCellValue !==0){
                legalMovesMap.set(cellCordKey,[]);
                continue;
            }
//console.log('legal moves map: '+legalMovesMap.get("0-1"))
            //FOR SOME REASON THIS LOOP ONLY RUNS TWICE EVEN THOUGH EACH CELL IS(?) CHECKED
            validNumsForCell = [];
            for(i=0;i<allowedNumbers.length;i++){
                targetNum = allowedNumbers[i];
                isInRow = nRows[r].includes(targetNum);
                isInCol = nCols[c].includes(targetNum);
//console.log('nRow'+nRows[r]+' targetNum '+targetNum+'test '+isInRow)
                if(!isInRow && !isInCol){
                    legalMove = true;
                    validNumsForCell.push(targetNum);
//console.log(validNumsForCell);
                }else{legalMove=false;}
//console.log('is it legal?: '+ targetNum +' '+legalMove+' rowVal ' +nRows[r]+'colVal '+nCols[c]+' cord '+cellCordKey);
            }
            legalMovesMap.set(cellCordKey,validNumsForCell)
        }
    }
    return(legalMovesMap)
}
