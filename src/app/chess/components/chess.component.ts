import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Game, Piece } from '../chess.classes';
import { Router } from '@angular/router';
import { Form, SelectMultipleControlValueAccessor } from '@angular/forms';
import { Time } from '../../../../node_modules/@angular/common';
import { ModeEnum } from '../mode.enum';

@Component({
  selector: 'app-chess',
  templateUrl: '../views/chess.component.html',
  styleUrls: ['../views/chess.component.css']
})
export class ChessComponent implements OnChanges{

  @Output() backEmitStr= new EventEmitter<string>();
  @Input() modeSelection: number;
  @Input() chessDisplay: string;
  @Input() clockTime: number = undefined;
  @Input() addedTime: number;
  @Input() resetFromWinnerDialogue: boolean;
  @Input() onePlayerColor: string = "W";
  FENIndex: number;
  AIMode: boolean = true;
  game: Game;
  selected: Array<number> = [null, null];
  second: Array<number> = [null, null];
  squareColor = 'white';
  FENString: string = "";
  resetFENString: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0"
  promoDialogueDisplay = "none";
  winnerDialogueDisplay= "none";
  boardDisplay = "block";
  promoInfo = {
    color: null,
    x: null,
    y: null,
    type: null
  }
  timerOn: boolean = false;
  timerChar: string = null;

  constructor(private router: Router) { 
    this.game = new Game();
    console.log(this.game.board);
    console.log("chess constructor in execution");
  }
  /**
   * ngOnChanges
   * is called whenever any of the data bound input properties above (ln 16-20) change
   * using this to set settings whenever the inputs(settings are changed)
   */
  ngOnChanges(){
    console.log('chess component ngOnChanges');
    console.log(this.modeSelection, this.clockTime, this.addedTime );

    this.configureTime(this.clockTime, this.addedTime);
    this.configureMode(this.modeSelection);
  }

  toHome(){
    this.backEmitStr.emit("back");
  }

  resetGame($event){
    this.FENString = this.resetFENString;
    this.submitFENString();
    this.winnerDialogueDisplay = "none";
  }

  setOpacity(i,j){//sets opacity of non-occupied squares to 0
    if(this.game.board[j][i].type == 'X'){
      return "0";
    }
    else{
      return "1";
    }
  }

  gameNav(command: number){
    if(command == -2){ //beginning
      this.FENIndex = 0;
      this.game.createFENBoard(this.game.FENPositionStack[this.FENIndex]);
    }
    else if(command == -1){ // back one
      this.FENIndex = this.FENIndex - 1;
      this.game.createFENBoard(this.game.FENPositionStack[this.FENIndex]);
    }
    else if (command == 1){ //forward one
      this.FENIndex = this.FENIndex + 1;
      this.game.createFENBoard(this.game.FENPositionStack[this.FENIndex]);
    }
    else if (command == 2){ //end
      this.FENIndex = this.game.FENPositionStack.length - 1;
      this.game.createFENBoard(this.game.FENPositionStack[this.FENIndex]);
    }
  }

  /**
   * configureTime
   * function to configure the clock total time and time added after a successful move is made before the game is started
   * @param clockTime 
   * @param addedTime 
   * @returns void
   */
  configureTime(clockTime: number, addedTime: number): void{

    this.timerOn = true;
    // this.timerChar = "W";
  }

  /**
   * 
   * @param mode configureMode
   * function to configure the game whether it is in 1 or 2 player mode and what difficulty the AI will be
   */
  configureMode(mode: number){
    if(mode == ModeEnum.TWO_PLAYER){

    }
    else if(mode == ModeEnum.ONE_PLAYER_EASY){

    }
    else if(mode == ModeEnum.ONE_PLAYER_MEDIUM){

    }
    else if(mode == ModeEnum.ONE_PLAYER_HARD){

    }

  }


  makeAIMove(colorChar: string):boolean{
    if(this.modeSelection == 0){//2player mode, leave function
      return false;
    }
    if(this.modeSelection == 1){//easy mode, select random square until your turn is over(color is back to players color)
      //this.sleep(500);
      if(this.onePlayerColor == "W" || this.AIMode == true){
        while(this.game.whiteTurn == false){
          this.selectSquare(Math.floor(7.99*Math.random()), Math.floor(7.99*Math.random()));
        }
      }
      if(this.onePlayerColor == "B" || this.AIMode == true){
        while(this.game.whiteTurn == true){
          this.selectSquare(Math.floor(7.9999*Math.random()), Math.floor(7.9999*Math.random()));
        }
      }
    }
  }

  receivePromoChar($event){
    this.game.promotionTimeBool = false;
    if(this.onePlayerColor == "W" || this.onePlayerColor == "B" || this.AIMode == true){
      this.promoInfo.type = "Q";
    }
    else{
      this.promoInfo.type = $event;//grab type of piece to swap 
    }
    
    this.promoDialogueDisplay = "none";
    this.boardDisplay = "block";

    this.game.board[this.promoInfo.x][this.promoInfo.y] = new Piece(this.promoInfo.y, this.promoInfo.x, this.promoInfo.type, this.promoInfo.color);

    if(this.promoInfo.color == "W"){
      this.second = [null,null];
      this.game.whiteTurn = false;
      
      if(this.game.checkSafeWKing() == false){
        console.log('w king not safe');
        console.log('reverting to ', this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
        this.game.createFENBoard(this.game.FENPositionStack[this.game.FENPositionStack.length-1])
      }
      else{

        if(this.game.takenPiece !== null){ //if a piece it taken
          this.game.takenPiece.type == "P" ? this.game.blackPawnGraveyard.push(this.game.takenPiece) : this.game.blackPieceGraveyard.push(this.game.takenPiece); //addi it to piece graveyard
          this.game.takenPiece = null; //reset taken piece to null
        }

        this.game.WCheck = false; //else of CHeckSafeWKing, so WK is safe, turn off Wcheck
        this.game.checkSetCastleBools();
        this.game.genPushFENString();
        this.FENIndex = this.game.FENPositionStack.length-1;
        console.log(this.game.FENPositionStack);
        this.timerChar = "B";
        if(this.game.checkCheckmate("B") == true){ //check to see if black is checkmated
          this.game.winner = "W";
          this.winnerDialogueDisplay = "block";
          this.timerOn = false;
        }
        if(!this.game.checkSafeBKing()){
          this.game.BCheck = true;
        }
      }
    }

    else{
      this.second = [null,null];
      this.game.whiteTurn = true;

      if(this.game.checkSafeBKing() == false){
        console.log('b king not safe');
        console.log('reverting to ', this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
        this.game.createFENBoard(this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
      }
      else{

        if(this.game.takenPiece !== null){ //if a piece it taken
          this.game.takenPiece.type == "P" ? this.game.whitePawnGraveyard.push(this.game.takenPiece) : this.game.whitePieceGraveyard.push(this.game.takenPiece); //add it to piece graveyard
          this.game.takenPiece = null; //reset taken piece to null
        }

        this.game.BCheck = false; //else of CHeckSafeWKing, so BK is safe, turn off Bcheck
        this.game.checkSetCastleBools();
        this.game.genPushFENString();
        this.timerChar = "W"
        this.FENIndex = this.game.FENPositionStack.length-1;
        console.log(this.game.FENPositionStack);
        if(this.game.checkCheckmate("W") == true){ //check to see if white is checkmated
          this.game.winner = "B";
          this.winnerDialogueDisplay = "block";
          this.timerOn = false;
        }
        if(!this.game.checkSafeWKing()){
          this.game.WCheck = true;
        }
      }
    }
  }



  selectSquare(i,j){
    console.log(this.game.board[j][i]);
    if( this.selected[0]=== null && this.selected[1] ===null){// if nothing is selected, select the clicked square
      if( (this.game.whiteTurn == true && this.game.board[j][i].color =='W') || (this.game.whiteTurn == false && this.game.board[j][i].color == "B")){//only select your own pieces
        this.game.board[j][i].squareColor = 'green';
        this.selected=[i,j];
      }
    }
    else if( this.selected[0]==i && this.selected[1]==j){// else if you clicked the square that was selected, unselect it
      this.game.board[j][i].squareColor = this.game.originalColor(i,j);
      this.selected= [null,null];
    }
    else{// else you have a square selected and clicked another, in which case, try to do that move
      //this.game.board[j][i].squareColor ='red';
      this.second=[i,j];

      if (this.game.whiteTurn == true){
        if(this.game.moveW(this.game.board, this.selected, this.second) == true){ //if move returns true

          if(this.game.board[this.second[1]][this.second[0]].color == "B"){
            this.game.takenPiece = this.game.board[this.second[1]][this.second[0]];//sets taken piece to potentially collect killed pieces for display, if move is valid
          }

          if(this.game.castleFlag !== null){//checks to see if castleFlag was set by moveW or moveB, and calls the function to perform the castle swapping
            this.game.performCastle();//swaps pieces to their correct positions and resets appropriate flags
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.selected = [null,null];
          }
          else if(this.game.enPassantFlag == true){
            this.game.performEnPassant(this.selected[1], this.selected[0]);
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.game.takenPiece = new Piece(null,null,"P", "B");
            this.selected = [null,null];
            this.game.enPassantFlag = false; 
            this.game.bEnPassantXpos = null;
          }
          else{

            this.game.board[j][i] = this.game.board[this.selected[1]][this.selected[0]];//swaps and updates pieces 
            this.game.board[j][i].xpos = i;//because swapped need to reupdate new position to be accurate
            this.game.board[j][i].ypos = j;
            this.game.board[this.selected[1]][this.selected[0]] = new Piece(this.selected[1], this.selected[0], 'X', 'X');
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.selected = [null,null];
          }
                  
          if(this.game.promotionTimeBool == true){ //check flag to see if we need to promote a White pawn, if we do, load the object with the info needed, and stop execution to wait for user to input promotion choice
            this.promoInfo.x = j;
            this.promoInfo.y = i;
            this.promoInfo.color = "W";
            this.promoDialogueDisplay = 'block';
            this.boardDisplay = "none";
            if(this.onePlayerColor == "B" || this.AIMode == true){
              this.receivePromoChar(null);
            }
          }

          else{
            this.second = [null,null];
            this.game.whiteTurn = false;
            
            if(this.game.checkSafeWKing() == false){
              console.log('w king not safe');
              console.log('reverting to ', this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
              this.game.createFENBoard(this.game.FENPositionStack[this.game.FENPositionStack.length-1])
            }
            else{

              if(this.game.takenPiece !== null){ //if a piece it taken
                this.game.takenPiece.type == "P" ? this.game.blackPawnGraveyard.push(this.game.takenPiece) : this.game.blackPieceGraveyard.push(this.game.takenPiece); //addi it to piece graveyard
                this.game.takenPiece = null; //reset taken piece to null
              }

              this.game.WCheck = false; //else of CHeckSafeWKing, so WK is safe, turn off Wcheck
              this.game.checkSetCastleBools();
              this.game.genPushFENString();
              this.timerChar = "B";
              this.FENIndex = this.game.FENPositionStack.length-1;
              console.log(this.game.FENPositionStack);
              if(this.game.checkCheckmate("B") == true){ //check to see if black is checkmated
                this.game.winner = "W";
                this.winnerDialogueDisplay = "block";
                this.onePlayerColor = null;
                this.AIMode = false;
                this.timerOn = false;
              }
              if(!this.game.checkSafeBKing()){
                this.game.BCheck = true;
              }
              if(this.onePlayerColor == "W" || this.AIMode == true) {
                this.makeAIMove("B");
              }
            }
          }
        }
      }
      else{
        if(this.game.moveB(this.game.board, this.selected, this.second) == true){


          if(this.game.board[this.second[1]][this.second[0]].color == "W"){
            this.game.takenPiece = this.game.board[this.second[1]][this.second[0]];
          }

          if(this.game.castleFlag !== null){//checks to see if castleFlag was set by moveW or moveB, and calls the function to perform the castle swapping
            this.game.performCastle();
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.selected = [null,null];
          }

          else if(this.game.enPassantFlag == true){
            this.game.performEnPassant(this.selected[1], this.selected[0]);
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.game.takenPiece = new Piece(null,null,"P", "W");
            this.selected = [null,null];
            this.game.enPassantFlag = false; 
            this.game.wEnPassantXpos = null;
          }

          else{
            this.game.board[j][i] = this.game.board[this.selected[1]][this.selected[0]];//update piece on board
            this.game.board[j][i].xpos = i;//because swapped need to reupdate new position to be accurate
            this.game.board[j][i].ypos = j;
            this.game.board[this.selected[1]][this.selected[0]] = new Piece(this.selected[1], this.selected[0], 'X', 'X');
            this.game.board[j][i].squareColor = this.game.originalColor(i,j);
            this.selected = [null,null];
          }

          if(this.game.promotionTimeBool == true){ //check flag to see if we need to promote a White pawn, if we do, load the object with the info needed, and stop execution to wait for user to input promotion choice

            this.promoInfo.x = j;
            this.promoInfo.y = i;
            this.promoInfo.color = "B";
            this.promoDialogueDisplay = 'block';
            this.boardDisplay = "none";
            if(this.onePlayerColor == "W" || this.AIMode == true){
              this.receivePromoChar(null);
            }
          }

          else{
            this.second = [null,null];
            this.game.whiteTurn = true;
            console.log("in else", "checking game.checksafeking, result: ", this.game.checkSafeBKing());
            if(this.game.checkSafeBKing() == false){
              console.log('b king not safe');
              console.log('reverting to ', this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
              this.game.createFENBoard(this.game.FENPositionStack[this.game.FENPositionStack.length-1]);
            }
            else{

              if(this.game.takenPiece !== null){ //if a piece it taken
                this.game.takenPiece.type == "P" ? this.game.whitePawnGraveyard.push(this.game.takenPiece) : this.game.whitePieceGraveyard.push(this.game.takenPiece); //add it to piece graveyard
                this.game.takenPiece = null; //reset taken piece to null
              }

              this.game.BCheck = false; //else of CHeckSafeWKing, so BK is safe, turn off Bcheck
              this.game.checkSetCastleBools();
              this.game.genPushFENString();
              this.timerChar = "W";
              this.FENIndex = this.game.FENPositionStack.length-1;
              console.log(this.game.FENPositionStack);
              if(this.game.checkCheckmate("W") == true){ //check to see if white is checkmated
                this.game.winner = "B";
                this.winnerDialogueDisplay = "block";
                this.onePlayerColor = null;
                this.AIMode = false;
                this.timerOn = false;
              }
              if(!this.game.checkSafeWKing()){
                this.game.WCheck = true; 
              }
              if(this.onePlayerColor == "B" || this.AIMode == true) {
                this.makeAIMove("W");
              }
            }
          }
        }
      }
    }
  }

  submitFENString(){
    this.selected = [null, null];
    this.second = [null, null];
    this.game = new Game();
    this.game.createFENBoard(this.FENString);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

