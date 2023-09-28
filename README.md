# tic-tac-toe
An online implementation of tic-tac-toe using Vanilla JS, CSS, and HTML. This implementation contains a "speedy" twist; featuring 
characters from the Sonic the Hedgehog franchise.

Players are able to pick their favorite hero or villain from the franchise and throw doen in a best of 3 implementation of tic-tac-toe. 
X's and O's are replaced by silhouette-like icons representing the selected character. The player can etiher compete with another 
human or play against an AI of varrying difficulty. Once the game is over, clicking anywhere outside of the container displaying the 
winning player will bring the player(s) back to the main menu. 

This application makes use of JS modules and factory functins as the goal was to put the least amount of code in the global space as possible.
The code itself is a bit mssy and no doubt requires refactoring later down the line, but the game itself is fully functional.

The AI was programmed using the minmax algorithm. I plan on adding alpha-beta pruning later on to improve optimization. Difficulty is handeled using
a modifier for each level of difficulty. On each of the AI's turns, it rolls a random float from 0-1 and if that number is greater than 1 - (diff. modifier),
the AI will use the mimax theorem to choose the next best move. If the roll is below the difference between 1 and the modifer, then the computer will xchooses
a random available space on the board. Obviously, there exist better ways to handle this, but the current method works for this small project. 


TO-DO:

1) Make AI vs AI matches work. (DONE!)
2) Add transitions (fade-in fade-out) and delays when the computer makes a move.
3) Make application play nice with devices with smaller screens/zoomed-in browsers.

**Images**
![TicTacToe](https://github.com/NMGVox/tic-tac-toe/assets/87345234/4fc7c6b9-30f0-4af3-a810-bfba9c1c352b)
![TicTacToe2](https://github.com/NMGVox/tic-tac-toe/assets/87345234/35c63883-b30f-4621-9aea-9b9e53efaa16)

[DEMO](https://nmgvox.github.io/tic-tac-toe/ "Tic-Tac-Toe")

Enjoy!
