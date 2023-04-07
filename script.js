var gameBoard = (function () {
    let spaces = [];
    let moves = 0;
    
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
        console.log(spaces)
    };

    function _updateSpaces(i, m) {
        spaces[i] = m;
    }
    return {
        initializeGame: function () {
            _makeBoard();
        },
        update: function (indx, mark) {
            _updateSpaces(indx, mark);
            console.log(spaces);
        },
        spaceAvailable: function(i) {
            return spaces[i];
        }
    };
})();

var controller = (function () {
    let players = [];
    let activePlayer;

    function _makePlayers() {
        players.push(playerFactory("human", 'X'));
        players.push(playerFactory("human", 'O'));
        activePlayer = players[0];
    }

    function _addMark(e) {
        if(gameBoard.spaceAvailable(e.target.getAttribute('index')) !== ''){
            return;
        }

        if (activePlayer.mark === 'O'){
            e.target.firstChild.src = './images/circle.svg';
        }else {
            e.target.firstChild.src = './images/cross.svg';
        }
        e.target.firstChild.style.display = 'block';

        gameBoard.update(e.target.getAttribute('index'), activePlayer.mark);
        if(activePlayer === players[0]){
            activePlayer = players[1]
        } else{
            activePlayer = players[0];
        }
    }

    return {
        addMark: function (e) {
            _addMark(e);
        },
        makePlayers: function() {
            _makePlayers();
        }
    }
})();

function playerFactory(ptype, mark) {
    return {ptype, mark};
}


document.querySelector('body').addEventListener('pointerdown', (event)=>{
    if(event.target.classList.contains('wrapper')) {
        controller.addMark(event);
    }
})

document.querySelector("#start").addEventListener('pointerdown', (event) =>{
    controller.makePlayers();
    gameBoard.initializeGame();
});