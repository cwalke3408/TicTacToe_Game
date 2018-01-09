/*
    * Tic Tac Toe GAME
    * 1/9/2018
    * Christian Walker

    * Description: A tic tac toe game featuring a mode to play vs the CPU or a two player mode.
                   Includes an addtional feature to choose which color to start off with.
    * TOOLS: JavaScript, HTML, CSS

*/

// Count the amount of moves throuhout current game.
// if 9 then the game is over as a tie. 
var COUNT_TURNS = 0;

$(document).ready(function(){

    // In the Main Menu
    var atMenu = false;
    var gMode = false;
    var p1Color = 1;
    var player1First = true;

    /* Read the values of the game mode and color choice switch sliders */
    $('input[id="gameMode"]').change(function(){
        if($(this).is(':checked')) gMode = true;
        else gMode = false;
    });
    $('input[id="colorChoice"]').change(function(){
        if($(this).is(':checked')) p1Color = 0;
        else p1Color = 1;
    });

    /* START BUTTON:
          Toggles back and forth from menu and game.
          Start the game from the beginning from the menu.
          End the game while in the game and return back to menu
    */
    $('.start').click(function(){
        $('#menu').toggle(atMenu);
        if(atMenu){
            atMenu = false;
         } else {
            atMenu = true;
            if(player1First) player1First = false;
            else player1First = true;

            $('h1').html('Tic Tac Toe');
            var ttt = new ticTacToe(p1Color);
            var gb = new gameBoard();
            gb.intboard();
            ttt.playingGame(gb, gMode, player1First);
         }
    });
});

/*  gameBoard
    Decription:
        class that contains objects methods to update, intilize,
        check valid positions, and check answers


*/
function gameBoard(){

    /* mArray: an object representing the game board

                * COLS *
            [[(0,0),(0,1),(0,2)]
   * ROW *   [(1,0),(1,1),(1,2)]
             [(2,0),(2,1),(2,2)]]

    */
    var mArray = [];

    /*  gameBoard.intboard
        Initialize a 3 by 3 multi-demetional array with the character 'y' to represent the game board
        RETURN: the new game board
    */
    this.intboard = function(){
        for(var row=0; row<3; row++){
            var cols = [];
            for(var col=0; col<3; col++){
                cols[col] = 'y';
                $('#box'+row+col).css('background-color', '#0F0817');
            }
            mArray[row] = cols;
        }
        return mArray;
    }

    /* Returns the game board */
    this.board = function(){ return mArray; };

    /*  gameBoard.update
        Takes an user or CPU input and update the board with that input
    */
    this.update = function(row, col, input){
        COUNT_TURNS++;
        return mArray[row][col] = input;
    }

    /*  gameBoard.answers
        Checks the given row, col, and digonals for possible winning solultions

        mode 0: Checks if previous input won the game
        mode 1: Use for CPU a.i.
                Checks the CPU has a possible choice to win
                Checks if user has possible chance to win and defends
    */
    this.answers = function(row, col, input, mode){
        function rowCheck(row, input){
            var count = 0;
            var valid = [];
            for(var i=0; i<3; i++){
                if(mArray[row][i] == input) count++;
                else if(mArray[row][i] == 'y') valid = [row, i];
            }
            if(count == 2 && valid.length != 0) return valid;
            return count;
        }

        function colCheck(col, input){
            var count = 0;
            var valid = [];
            for(var i=0; i<3; i++){
                if(mArray[i][col] == input) count++;
                else if(mArray[i][col] == 'y') valid = [i, col];
            }
            if(count == 2 && valid.length != 0) return valid;
            return count;
        }
        function digRight(input){
            var count = 0;
            var valid = [];
            for(var i=0; i<3; i++){
                if(mArray[i][i] == input) count++;
                else if(mArray[i][i] == 'y') valid = [i, i];
            }
            if(count == 2 && valid.length != 0) return valid;
            return count;
        }
        function digLeft(input){
            var count = 0;
            var valid = [];
            var j=2;
            for(var i=0; i<3; i++){
                if(mArray[i][j] == input) count++;
                else if(mArray[i][j] == 'y') valid = [i, j];
                j--;
            }
            if(count == 2 && valid.length != 0) return valid;
            return count;
        }

        function cAnswer(checkAns){
            if(checkAns == NAN) return checkAns;
            return false;
        }

        if(mode === 0){
            if(rowCheck(row, input) === 3) return 'true';
            if(colCheck(col, input) === 3) return 'true';
            if(digRight(input) === 3) return 'true';
            if(digLeft(input) === 3) return 'true';
            if(COUNT_TURNS === 9) return 'cat';
        } else if(mode === 1){
            var checkAns;
            checkAns = rowCheck(row, input);
            if(checkAns.constructor === Array) return checkAns;
            checkAns = colCheck(col, input);
            if(checkAns.constructor === Array) return checkAns;
            checkAns = digRight(input);
            if(checkAns.constructor === Array) return checkAns;
            checkAns = digLeft(input);
            if(checkAns.constructor === Array) return checkAns;
        }
        return false;
    }

    /*  gameBoard.firstValid
        Use for CPU a.i.
        If the CPU cannot find position to win the game or defend
        then find the first legal spot to place an input
    */
    this.firstValid = function(){
        for(var row = 0; row < 3; row++){
            for(var col = 0; col < 3; col++){
                if(mArray[row][col] == 'y') return [row, col];
            }
        }
    }

    /* checks if the given input is still avalible  */
    this.valid = function(row, col){
        return (mArray[row][col] == 'y');
    }
}

/*
 * Start game (or Reset Game)
 * Let player 1 go
    * check if user selected an valid input
    * check if user won the game
        * True
            * Display winner
            * Reset
        * False
            * Let player 2
*/
function ticTacToe(user){
    var gMode  = false;
    var prevCPU = [0,0];
    var player1First = true;

    var player =
    [   { color: '#F66733', symbol:'o'},
        { color:' #522D80', symbol:'p'}
    ];

    /*
        * Decide 1 or 2 player game
        * Decide who goes first
        * Control the work flow
    */
    this.playingGame = function(gb, checkMode, player1First){
        COUNT_TURNS = 0;
        if(checkMode){
            if(!player1First){
                cpuTurn(gb, 0, 0, player[user].symbol);
                playerTurn(gb, false);
            } else {
                playerTurn(gb, false);
            }
        } else {
            playerTurn(gb, true);
        }
    }

    /* playerTurn
        Description:
            Waits for an user input checks if position is avalible,
            check if user won, and let opponent go after
        Parameter:
            gb: gameboard class
            offCPU: true -> 2 player game
                    false -> let CPU go after user input
    */
    function playerTurn(gb, offCPU){
        // Handle multiple firings to one
        $('.box').unbind('click').bind('click', function(){
            if(gb.valid(this.id[3], this.id[4])){                                       // check if given position is avalible
                if(user == 0) user = 1;
                else user = 0;

    			$(this).css('background-color', player[user].color);
                gb.update(this.id[3],this.id[4], player[user].symbol);                  // update the game board
                var answer = gb.answers(this.id[3],this.id[4], player[user].symbol, 0); // check if the user won the game

                if(answer === 'true') gameWon(user);
                else if(answer == 'cat') gameWon(-1);
                else {
                    if(!offCPU){
                        cpuTurn(gb, this.id[3], this.id[4], player[user].symbol);       // Let the CPU go
        			}
                }
            }
        });
    }

    /* cpuTurn
        Decription:
            Checks CPUs previous
        Parameter:
            gb: gameboard class
            row: row position of user's previous input
            col: col position of user's previous input
    */
    function cpuTurn(gb, row, col){
        // Plays defense
        // Check to see if opponent is close to winning
        if(user == 0){
             user = 1;
             tempUser = 0;
         }
        else{
             user = 0;
             tempUser = 1;
         }

         /*
            Checks if prev input position row/col has a case to win
            case to win: if that row/col has 2 cpu entries and if that remaining
            spot is still avalible.
            If the position is still avalible, choice that spot an win the game
         */
        var ans = gb.answers(prevCPU[0],  prevCPU[1], player[user].symbol, 1);
        if(checkAns(ans)) return;


        /* Check User prev input position row/col has a case to win
            Choice the spot where the user would win the game
        */
        ans = gb.answers(row, col, player[tempUser].symbol, 1);
        if(checkAns(ans)) return;

        // Choice first avalible spot it finds
        ans = gb.firstValid();
        if(checkAns(ans)) return;

        function checkAns(result){
            if(result != false){
                prevCPU = result;
                $('#box'+result[0]+result[1]).css('background-color', player[user].color);
                gb.update(ans[0], ans[1], player[user].symbol);                  // Update the board with the CPU input

                var answer = gb.answers(ans[0], ans[1], player[user].symbol, 0); // Check if the CPU won the game
                if(answer === 'true') gameWon(user);
                else if(answer == 'cat') gameWon(-1);
                return true;
            }
            return false;
        }
    }

    /* Display that Player 1, 2, or CPU won the game or Cat game */
    function gameWon(winner){
        if(winner === -1) $('h1').html('Cat GAME');
        else{
            winner++;
            $('h1').html('Player ' + winner + ' Won');
        }
        $('.box').off('click');
    }
}
