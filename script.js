var gameBoard = (function () {
    let spaces = [];
    let _gameActive = false;

    function _makeBoard(){
        let board = document.createElement('div');
        board.className = "gameboard";
        board.id = 'gameboard';

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
        document.querySelector('body').appendChild(board);
        document.getElementById('start').style.display = 'none';
    };

    function _triggerGame() {
        _gameActive = !_gameActive;
    }

    function _updateSpaces(i, m) {
        spaces[i] = m;
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
        endGame: function() {
            _triggerGame();
        },
        getCurrentState: function() {
            return spaces;
        }
    };
})();

var controller = (function () {
    let players = [];
    let activePlayer;
    let _moves = 0;
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

    function _makePlayers() {
        players.push(playerFactory("human", 'X'));
        players.push(playerFactory("cpu", 'O'));
        activePlayer = players[0];
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
        console.log("Tie.");
        gameBoard.endGame();
    }

    function _checkWin(state, currentplayer) {
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
        if(_checkWin(state, isMaximizingPlayer)){
            if(isMaximizingPlayer.ptype !== "cpu"){
                return -10 + depth;
            }
            return 10 - depth;
        }
        if( depth === 9) {
            return 0;
        }

        if (isMaximizingPlayer.ptype === "cpu" ) {
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
        guiBoard[indx].firstChild.src = './images/circle.svg';
        guiBoard[indx].firstChild.style.display  = 'block';
        _moves++;

        if(controller.getMoves() >= 5){
            if (controller.checkWin(gameBoard.getCurrentState(), controller.getActivePlayer())){
                console.log(`${controller.getActivePlayer().mark} wins!`)
                gameBoard.endGame();
            }
        }

        console.log(_moves);
        _switchActivePlayer();
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
        checkWin: function(state, currentplayer) {
            return _checkWin(state, currentplayer);
        },
        cpuMark : function() {
            return _cpuMark();
        }
    }
})();

function playerFactory(ptype, mark) {

    function addMark(e) {
        if(gameBoard.getSpace(e.target.getAttribute('index')) !== ''){
            return;
        }
        if (mark === 'O'){
            e.target.firstChild.src = './images/circle.svg';
        }else {
            e.target.firstChild.src = './images/cross.svg';
        }
        e.target.firstChild.style.display = 'block';

        gameBoard.update(e.target.getAttribute('index'), mark);

        controller.increaseMoves();

        //check winning state
        if(controller.getMoves() >= 5){
            if (controller.checkWin(gameBoard.getCurrentState(), controller.getActivePlayer())){
                console.log(`${controller.getActivePlayer().mark} wins!`)
                gameBoard.endGame();
            }
        }

        controller.switchActivePlayer();
        if (gameBoard.isGameActive() && controller.getActivePlayer().ptype === "cpu"){ 
            setTimeout(controller.cpuMark, 1000);
        }
        
    }
    return {ptype, mark, addMark};
}


document.querySelector('body').addEventListener('pointerdown', (event)=>{
    if(event.target.classList.contains('wrapper') && gameBoard.isGameActive()) {
        controller.getActivePlayer().addMark(event);
    }

})

document.querySelector("#start").addEventListener('pointerdown', (event) =>{
    controller.makePlayers();
    gameBoard.initializeGame();
});