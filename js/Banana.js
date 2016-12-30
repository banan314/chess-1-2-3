var board,
  game = new Chess(),
  moveIt = 1,
  moveCurMax = 1,
  colorTurn = 'w'; //for debugging
  /* statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn'); */
  
  var BLACK = 'b';
  var WHITE = 'w';

function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
}

function isTimeForTurnFlip(moveit, moveCurMax) {
    return moveit > moveCurMax;
}

// do not pick up pieces if the game is over
// it means that whether king is checkmated or there's insufficient material
// only pick up pieces for the side to move

/*var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (colorTurn === 'w' && piece.search(/^b/) !== -1) ||
      (colorTurn === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};*/
var onDragStart = function(source, piece, position, orientation) {return true;}

var onDrop = function(source, target) {
  // see if the move is legal
  //game.turn = colorTurn;
  /* var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
	//THIS IS TO BE CHANGED!
  }); */
  var movingPiece = game.get(source);
  if(!movingPiece || movingPiece.color != colorTurn)
    return 'snapback';

    if(game.is_legal({from: source, to: target, promotion: false})) {
        game.put(movingPiece, target);
        game.remove(source);

        moveIt++;
        if (isTimeForTurnFlip(moveIt, moveCurMax))
        {
            game.change_turn();
            colorTurn = game.turn();

            moveCurMax++;
            moveIt = 1;
        }
    }

  //if (game.turn() !== colorTurn) game.functionReverseTurn();
  //check if the king is checked:
  /*if(game.turn !== colorTurn)
  {

	  var changedFEN = game.fen();
	  if (changedFEN.search(' b ') === -1)
		changedFEN.replace(' w ', ' b ');
	  else
		changedFEN.replace(' b ', ' w ');

	game = new Chess(changedFEN);

  }*/


  console.log('moveIt=' + moveIt + '; Max=' + moveCurMax + '; turn: ' + game.turn() +
  '; cturn: ' + colorTurn);

  updateStatus();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  /* statusEl.html('Status: ' + status);
  fenEl.html('FEN: ' + game.fen());
  pgnEl.html('PGN: ' + game.pgn()); */
  
  $('#status').html(status);
  $('#fen').html(game.fen());
  $('#pgn').html(game.pgn());
};

var cfg = {
  draggable: true,
  position: 'start',
  legal: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

$(document).ready( function(){
  board = new ChessBoard('board', cfg);
    updateStatus();
    /*while(!game_over()) {

        updateStatus();
    }*/
});

