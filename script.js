var gameBoard = (function () {
    let moves = 0;
    
    function _makeBoard(){
        let board = document.createElement('div');
        board.className = "gameboard";
        board.id = 'gameboard';
        for(let i = 0; i < 9; i++){
            let newWrap = document.createElement('div');
            let newSpace = document.createElement('img');
            newWrap.className = ('wrapper');
            newWrap.appendChild(newSpace);
            newWrap.setAttribute('index', i);
            board.appendChild(newWrap);
        }
        document.querySelector('body').appendChild(board);
        document.getElementById('start').style.display = 'none';
    };

    

    return {
        initializeGame: function () {
            _makeBoard();
        }
    };
})();


document.querySelector('body').addEventListener('pointerdown', (event)=>{
    if(event.target.classList.contains('wrapper')) {
        console.log("Sorta works.");
    }
})

document.querySelector("#start").addEventListener('pointerdown', gameBoard.initializeGame);