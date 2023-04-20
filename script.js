function loadImages () {
    let squares = Array.from(document.querySelectorAll('.character'));
    squares.forEach(square => {
        square.style.backgroundImage = `url(./images/portraits/${square.getAttribute('data-character')}-portrait.png)`;
    });
    return;
}

function addReset() {
    let boardWrapper = document.querySelector('.board-wrapper');
    let reset = document.createElement('button');
    reset.type = 'button';
    if(controller.getActivePlayer().score < 2) {
        reset.textContent = "Continue";
        reset.id = 'reset';
        reset.addEventListener('pointerdown', controller.softReset);
        boardWrapper.appendChild(reset);
        return reset;
    }
    reset.textContent = "Reset Game";
    reset.id = 'reset';
    reset.addEventListener('pointerdown', controller.resetGame);
    boardWrapper.appendChild(reset);
    return reset;
}

function deselectSiblings(char) {
    let siblings = Array.from(document.querySelectorAll(`#${char.parentNode.id}>.character`));
    siblings.forEach(sibling => {
        if(sibling.getAttribute('data-character') !== char.getAttribute('data-character')) {
            sibling.classList.remove('selected');
        }
    });
}

function selectCharacter(e) {
    let char = e.target;
    if(char.classList.contains('selected')) {
        return;
    }
    deselectSiblings(char);
    char.classList.add('selected');
}

function generatePlayerInfo() {
    let contentArr = [];
    let players = controller.getPlayers();
    for (let i = 0; i < 2; i++) {
        let newDiv = document.createElement('div');
        newDiv.id = `p${i+1}`;
        newDiv.className = 'player-info';
        let pName = document.createElement('h2');
        pName.textContent = players[i].name;
        pName.className = "player-name";
        let portrait = document.createElement('img');
        portrait.className = 'player-portrait';
        portrait.src = `./images/portraits/${players[i].dataref}-portrait.png`;
        let pScore = document.createElement('h1');
        pScore.className = 'player-score';
        pScore.textContent = 0;
        newDiv.appendChild(pName);
        newDiv.appendChild(portrait);
        newDiv.appendChild(pScore);
        contentArr.push(newDiv);
    }
    return contentArr;
}

function removeDimmer() {
    document.querySelector('.dimmer').remove();
    return;
}

function displayWinner(winner) {
    let dimmer = document.createElement('div');
    dimmer.className = 'dimmer';
    let winnerCard = document.createElement('div');
    winnerCard.className = 'winner-card';

    let winner_image = document.createElement('img');
    winner_image.className = "win-img";
    winner_image.src = `./images/defaults/${winner.dataref}-large.png`;

    let win_text = document.createElement('h1');
    win_text.className = 'win-text';
    win_text.textContent = `${winner.name} wins!`;

    let instruct_text = document.createElement('h3');
    instruct_text.className = 'instruct-text';
    instruct_text.textContent = `Click anywhere outside to continue!`;

    winnerCard.append(winner_image, win_text, instruct_text);

    dimmer.appendChild(winnerCard);

    dimmer.addEventListener('pointerdown', removeDimmer);

    document.querySelector('body').appendChild(dimmer);
    return;
}

var gameBoard = (function () {
    let spaces = [];
    let _gameActive = false;

    function _clearBoard() {
        document.querySelector(".game-wrap").remove();
        spaces = [];
        return;
    }

    function _resetBoard() {
        let spaceArr = Array.from(document.querySelectorAll(".space"));
        for (let i = 0; i < spaceArr.length; i++) {
            spaceArr[i].style.display = 'none';
            spaces[i] = '';
        }
        return;
    }

    function _makeBoard(){
        let gameWrapper = document.createElement('div');
        gameWrapper.className = 'game-wrap';
        let player_info = generatePlayerInfo();
        let board = document.createElement('div');
        board.className = "gameboard";
        board.id = 'gameboard';
        let boardWrapper = document.createElement('div');
        boardWrapper.className = 'board-wrapper';
        for(let i = 0; i < 9; i++){
            let newWrap = document.createElement('div');
            let newSpace = document.createElement('img');
            
            newWrap.className = ('wrapper');
            newSpace.className = ('space');

            newWrap.appendChild(newSpace);
            newWrap.setAttribute('index', i);
            board.appendChild(newWrap);
            spaces.push('');
        }
        boardWrapper.appendChild(board)
        gameWrapper.appendChild(player_info[0]);
        gameWrapper.appendChild(boardWrapper);
        gameWrapper.appendChild(player_info[1]);
        document.querySelector('body').appendChild(gameWrapper);
        document.getElementById('start').style.display = 'none';
        document.getElementById('menu').style.display = 'none';
        return;
    };

    function _triggerGame() {
        _gameActive = !_gameActive;
    }

    function _updateSpaces(i, m) {
        spaces[i] = m;
    }

    function _allAvailableSpaces() {
        avail = [];
        for(let  i = 0; i < spaces.length; i++) {
            if(spaces[i] == ''){
                avail.push(i);
            }
        }
        return avail;
    }

    return {
        initializeGame: function () {
            _makeBoard();
            _triggerGame();
        },
        update: function (indx, mark) {
            _updateSpaces(indx, mark);
        },
        getSpace: function(i) {
            return spaces[i];
        },
        isGameActive: function() {
            return _gameActive;
        },
        triggerGame: function() {
            _triggerGame();
        },
        getCurrentState: function() {
            return spaces;
        },
        clearBoard: function() {
            return _clearBoard();
        },
        resetBoard: function() {
            return _resetBoard();
        },
        allAvailableSpaces: function() {
            return _allAvailableSpaces();
        }
    };
})();

var controller = (function () {
    let players = [];
    let activePlayer;
    let _moves = 0;
    let round = 0;
    //let _allowInput = true;
    const _winningStates = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
        [0,4,8]
    ]

    function _resetGame() {
        gameBoard.clearBoard();
        players = [];
        _moves = 0;
        round = 0;
        activePlayer = null;
        document.getElementById('start').style.display = 'inline-block';
        document.getElementById('menu').style.display = 'flex';
        return;
    }

    function _softReset() {
        gameBoard.resetBoard();
        round++;
        _moves = 0;
        document.querySelector("#reset").remove();
        document.querySelector('.board-wrapper').firstChild.remove();
        gameBoard.triggerGame();
        activePlayer = players[round % 2];
        if(activePlayer.ptype !== 'hum') {
            _cpuMark();
        }
        return;
    }

    function _makePlayers() {
        p1 = document.querySelector("#heroes>.selected");
        p2 = document.querySelector("#villains>.selected");
        p1type = document.querySelector('#player1-options>input[name="h_ptype"]:checked').value;
        p2type = document.querySelector('#player2-options>input[name="h_ptype"]:checked').value;
        console.log(p1.getAttribute('data-character'))
        players.push(playerFactory(p1type, 1, 'X', p1.textContent, p1.getAttribute('data-character')));
        players.push(playerFactory(p2type, 2, 'O', p2.textContent, p2.getAttribute('data-character')));
        activePlayer = players[0];
    }

    function _updateScore() {
        document.querySelector(`#p${activePlayer.num}>.player-score`).textContent = activePlayer.score;
    }

    function _switchActivePlayer() {
        if(activePlayer === players[0]){
            activePlayer = players[1];
        } else{
            activePlayer = players[0];
        }
    }

    function _returnOppPlayer() {
        if(activePlayer === players[0]){
            return players[1];
        } else{
            return players[0];
        }
    }

    function _drawGame() {
        _announceRoundWinner('tie');
        addReset();
        gameBoard.triggerGame();
    }

    function _announceRoundWinner(winner) {
        let boardWrapper = document.querySelector('.board-wrapper');
        let win_text = document.createElement('h2');
        if(winner === 'tie') {
            win_text.textContent = `Tie!`;
        }else{
            win_text.textContent = `${winner.name} wins round ${round+1}`;
        }
        win_text.className = 'round-win';
        boardWrapper.insertBefore(win_text, boardWrapper.firstChild);
        return;
    }

    function _IsWinningMove(state, currentplayer) {
        winner = currentplayer.mark.repeat(3);
        for (let i = 0; i < _winningStates.length; i++) {
            let ele = _winningStates[i];
            let combination = (state[ele[0]]  + state[ele[1]] + state[ele[2]]);
            if (winner === combination) {
                return true;
            }
        }
        if(_moves === 9) {
            _drawGame();
        }
        return false;
    }

    function _minimax(state, depth, isMaximizingPlayer) {
        if(_IsWinningMove(state, isMaximizingPlayer)){
            if(isMaximizingPlayer.ptype === "hum"){
                return -10 + depth;
            }
            return 10 - depth;
        }
        if( depth === 9) {
            return 0;
        }

        if (isMaximizingPlayer.ptype !== "hum" ) {
            let value = -999999;
            for(let i = 0; i < state.length; i++) {
                if(state[i] !== '') { continue; }
                state[i] = isMaximizingPlayer.mark;
                value = Math.max(value, _minimax(state, depth + 1, _returnOppPlayer()));
                state[i] = '';
            }
            return value;
        } else {
            let value = 999999;
            for(let i = 0; i < state.length; i++) {
                if(state[i] !== '') { continue; }
                state[i] = isMaximizingPlayer.mark;
                value = Math.min(value, _minimax(state, depth + 1, activePlayer));
                state[i] = '';
            }
            return value;
        }
    }

    function _nextBestMove(state){
        chanceOfBestMove = Math.random();
        console.log(activePlayer.getModifier());

        if(chanceOfBestMove < 1 - activePlayer.getModifier()) {
            console.log("?");
            let avail = gameBoard.allAvailableSpaces();
            return avail[Math.floor(Math.random() * avail.length)];
        }
        
        let bestMove = null;
        let bestVal = -Infinity;
        for (let i = 0; i < state.length; i ++){
            if(state[i] !== ''){
                continue;
            }
            let temp = state.slice(0, 9);
            temp[i] = activePlayer.mark;
            let thisMove = _minimax(temp, _moves+1, _returnOppPlayer());
            if (thisMove > bestVal ) {
                bestVal = thisMove;
                bestMove = i;
            }
        }
        return bestMove;
    }

    function _cpuMark(){
        let indx = _nextBestMove(gameBoard.getCurrentState());
        gameBoard.update(indx, activePlayer.mark);
        let guiBoard = Array.from(document.querySelectorAll('.wrapper'));
        guiBoard[indx].firstChild.src = activePlayer.vismark;
        guiBoard[indx].firstChild.style.display  = 'block';
        _moves++;

        checkWinner();

        _switchActivePlayer();
        return;
    }

    function checkWinner() {
        if(_moves < 5) {
            return;
        }
        if (controller.IsWinningMove(gameBoard.getCurrentState(), controller.getActivePlayer())){
            activePlayer.score++;
            _updateScore();
            _announceRoundWinner(activePlayer);
            gameBoard.triggerGame();
            addReset();
        }
        if (activePlayer.score >= 2) {
            displayWinner(activePlayer);
        }
        return;
    }

    return {
        addMark: function (e) {
            _addMark(e);
        },
        makePlayers: function() {
            _makePlayers();
        },
        getActivePlayer: function() {
            return activePlayer;
        },
        switchActivePlayer: function() {
            _switchActivePlayer();
        },
        increaseMoves: function() {
            _moves++;
        },
        getMoves: function() {
            return _moves;
        },
        IsWinningMove: function(state, currentplayer) {
            return _IsWinningMove(state, currentplayer);
        },
        cpuMark : function() {
            return _cpuMark();
        },
        resetGame: function () {
            return _resetGame();
        },
        getPlayers: function() {
            return players;
        },
        softReset: function() {
            return _softReset();
        },
        checkWinner
    }
})();

function playerFactory(ptype, num, mark, name, dataref) {
    let score = 0;
    let vismark = `./images/marks/${dataref}-mark.png`;
    
    function getModifier() {
        if(ptype === "e") {
            return .15;
        }else if(ptype === 'n') {
            return .35;
        }else if(ptype === 'h') {
            return .60;
        }else {
            return 1;
        }
    }

    function addMark(e) {
        if(gameBoard.getSpace(e.target.getAttribute('index')) !== ''){
            console.log(gameBoard.getSpace(e.target.getAttribute('index')));
            return;
        }
        e.target.firstChild.src = vismark;
        e.target.firstChild.style.display = 'block';

        gameBoard.update(e.target.getAttribute('index'), mark);

        controller.increaseMoves();

        //check winning state
        controller.checkWinner();

        controller.switchActivePlayer();
        if (gameBoard.isGameActive() && controller.getActivePlayer().ptype !== "hum"){ 
            setTimeout(controller.cpuMark);
        }
    }
    return {ptype, num, mark, dataref, name, score, vismark, addMark, getModifier};
}

document.querySelector('body').addEventListener('pointerdown', (event)=>{
    if(event.target.classList.contains('wrapper') && gameBoard.isGameActive()) {
        controller.getActivePlayer().addMark(event);
    }
});

document.querySelector("#start").addEventListener('pointerdown', (event) =>{
    controller.makePlayers();
    gameBoard.initializeGame();
});

const characters = Array.from(document.querySelectorAll(".character"));
characters.forEach(element => {
    element.addEventListener('pointerdown', selectCharacter);
});

window.addEventListener('load', loadImages);