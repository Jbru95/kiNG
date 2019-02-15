import { MoveTableRow } from './components/moveTable.component';

export class Game {

    board: Array<Array<Piece>>;
    whiteTurn: boolean; // true if whites turn, false if black
    knightArray = new Array<Array<number>>();
    kingArray = new Array<Array<number>>();
    BCheck = false;
    WCheck = false;
    FENPositionStack = new Array<string>();
    turnCounter: number = 1;
    promotionTimeBool: boolean = false;
    winner: string = null;

    wEnPassantXpos: number = null;
    bEnPassantXpos: number = null;
    enPassantFlag: boolean = false;

    whitePawnGraveyard: Array<Piece> = new Array<Piece>();
    whitePieceGraveyard: Array<Piece> = new Array<Piece>();
    blackPawnGraveyard: Array<Piece> = new Array<Piece>();
    blackPieceGraveyard: Array<Piece> = new Array<Piece>();
    takenPiece: Piece = null;

    blockObj: any = {
        attackingType: "",
        attackingColor: "",
        attackingXpos: null,
        attackingYpos: null
    }

    castleBoolObj: any = {
        KSideWCastleBool: true,
        QSideWCastleBool: true,
        KSideBCastleBool: true,
        QSideBCastleBool: true
    }
    castleFlag: string = null;
    
    constructor(){
        this.board = new Array<Array<Piece>>();

        this.knightArray.push([-2,-1],[-2,1],[-1,2],[-1,-2],[1,2],[1,-2],[2,-1],[2,1]);
        this.kingArray.push([-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]);
        this.whiteTurn = true;
        this.createDefaultBoard();
        //this.createFENBoard(" ");

    }

    createDefaultBoard(){
        //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        this.FENPositionStack.push("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0"); //8/PPP5/8/8/8/8/ppp5/8 w 0

        for( let k = 0; k < 8; k++) {
            let row = new Array<Piece>();
            this.board.push(row);
        }
        
        this.board[0][0] = new Piece(0,0,"R","B");
        this.board[0][1] = new Piece(0,1,"N","B");
        this.board[0][2] = new Piece(0,2,"B","B");
        this.board[0][3] = new Piece(0,3,"Q","B");
        this.board[0][4] = new Piece(0,4,"K","B");
        this.board[0][5] = new Piece(0,5,"B","B");
        this.board[0][6] = new Piece(0,6,"N","B");
        this.board[0][7] = new Piece(0,7,"R","B");
        this.board[1][0] = new Piece(1,0,"P","B");
        this.board[1][1] = new Piece(1,1,"P","B");
        this.board[1][2] = new Piece(1,2,"P","B");
        this.board[1][3] = new Piece(1,3,"P","B");
        this.board[1][4] = new Piece(1,4,"P","B");
        this.board[1][5] = new Piece(1,5,"P","B");
        this.board[1][6] = new Piece(1,6,"P","B");
        this.board[1][7] = new Piece(1,7,"P","B");

        for(let i = 2; i<6; i++){
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Piece(i,j, 'X', 'X');
            }
        }

        this.board[6][0] = new Piece(6,0,"P","W");
        this.board[6][1] = new Piece(6,1,"P","W");
        this.board[6][2] = new Piece(6,2,"P","W");
        this.board[6][3] = new Piece(6,3,"P","W");
        this.board[6][4] = new Piece(6,4,"P","W");
        this.board[6][5] = new Piece(6,5,"P","W");
        this.board[6][6] = new Piece(6,6,"P","W");
        this.board[6][7] = new Piece(6,7,"P","W");
        this.board[7][0] = new Piece(7,0,"R","W");
        this.board[7][1] = new Piece(7,1,"N","W");
        this.board[7][2] = new Piece(7,2,"B","W");
        this.board[7][3] = new Piece(7,3,"Q","W");
        this.board[7][4] = new Piece(7,4,"K","W");
        this.board[7][5] = new Piece(7,5,"B","W");
        this.board[7][6] = new Piece(7,6,"N","W");
        this.board[7][7] = new Piece(7,7,"R","W");
    }

    createFENBoard(FEN: string){//DONE

        let fenStr = FEN;
        let fenAry = fenStr.split(" ");
        let rowAry = fenAry[0].split("/");

        //["rnbqkbnr", "pppppppp", "8", "8", "8", "8", "PPPPPPPP", "RNBQKBNR"]

        for(let i = 0; i < rowAry.length; i++){
            let ind = 0;                                    //keeping seperate track of index, index != j in all cases
            for(let j = 0; j < rowAry[i].length; j++){

                let char = rowAry[i][j];
                if(isNaN( parseInt(char)) == true){         //is not a number, add appropriate piece to board
                    if( char == char.toLowerCase() ){           //lower case, is a black piece
                        this.board[i][ind] = new Piece(i,ind,char.toUpperCase(),"B");
                        ind++;
                    }
                    else if( char == char.toUpperCase() ) {     //upper case, is a white piece
                        this.board[i][ind] = new Piece(i,ind,char.toUpperCase(),"W");
                        ind++;
                    }
                }
                else{                                       //is a number, add k number of consecutive blank spaces
                    for(let k = 0; k < parseInt(char); k++){
                        this.board[i][ind] = new Piece(i,ind,"X","X");
                        ind++
                    }
                }
            }
        }

        if(fenAry[1] == "w" || fenAry[1] == "W"){
            this.whiteTurn = true;
        }
        if(fenAry[1] == "B" || fenAry[1] == "b"){
            this.whiteTurn = false;
        }

        let castleBoolStr = fenAry[2];// sets FenAry[2](castle string) to castleBoolstr
        castleBoolStr.includes("K") ? this.castleBoolObj.KSideWCastleBool = true : this.castleBoolObj.KSideWCastleBool = false //checks to see if the letter is contained in the string and sets bool appropriately
        castleBoolStr.includes("Q") ? this.castleBoolObj.QSideWCastleBool = true : this.castleBoolObj.QSideWCastleBool = false
        castleBoolStr.includes("k") ? this.castleBoolObj.KSideBCastleBool = true : this.castleBoolObj.KSideBCastleBool = false
        castleBoolStr.includes("q") ? this.castleBoolObj.QSideBCastleBool = true : this.castleBoolObj.QSideBCastleBool = false

        //en passant logic also needs to be done

        this.turnCounter = parseInt(fenAry[3])
    }

    genPushFENString(){
        //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        //"r3k2r/8/8/8/7n/8/R3K2R/8 w KQkq 12"
        let FENString = "";

        for(let i = 0; i < this.board.length; i++){
            let emptyNumber = 0;
            for(let j = 0; j < this.board.length; j++){
                let square = this.board[i][j];
                if(square.color != "B" && square.color != "W"){
                    emptyNumber += 1;
                }
                else if (square.color == 'B'){
                    if(emptyNumber != 0){
                        FENString += String(emptyNumber);
                        emptyNumber = 0;
                    }
                    FENString += square.type.toLowerCase();
                }
                else if(square.color == "W"){
                    if(emptyNumber != 0){
                        FENString += String(emptyNumber);
                        emptyNumber = 0;
                    }
                    FENString += square.type;
                }
            }
            if(emptyNumber != 0){
                FENString += String(emptyNumber);
                emptyNumber = 0;
            }
            FENString += "/";
        }

        this.whiteTurn == true ? FENString += " w " : FENString += " b ";

        if(this.castleBoolObj.KSideWCastleBool == true) { FENString += "K"};
        if(this.castleBoolObj.QSideWCastleBool == true) { FENString += "Q"};
        if(this.castleBoolObj.KSideBCastleBool == true) { FENString += "k"};
        if(this.castleBoolObj.QSideBCastleBool == true) { FENString += "q"};

        FENString += " ";


        FENString += this.turnCounter;

        this.FENPositionStack.push(FENString);
    }

    checkSetCastleBools(){
        if(this.board[7][7].type != "R" && this.board[7][7].color != "W"){ //check for W Kside Rook movement
            this.castleBoolObj.KSideWCastleBool = false;
        }
        if(this.board[7][0].type != "R" && this.board[7][0].color != "W"){ // W Qside Rook movement
            this.castleBoolObj.QSideWCastleBool = false;
        }
        if(this.board[0][7].type != "R" && this.board[0][7].color != "B"){ //check for B Kside Rook movement
            this.castleBoolObj.KSideBCastleBool = false;
        }
        if(this.board[0][0].type != "R" && this.board[0][0].color != "B"){ // B Qside Rook movement
            this.castleBoolObj.QSideBCastleBool = false;
        }

        if(this.board[0][4].type != "K" && this.board[0][4].color !="B"){ //Check for BK movement
            this.castleBoolObj.KSideBCastleBool = false;
            this.castleBoolObj.QSideBCastleBool = false;
        }

        if(this.board[7][4].type != "K" && this.board[7][4].color != "W"){ //Check for WK movement
            this.castleBoolObj.KSideWCastleBool = false;
            this.castleBoolObj.QSideWCastleBool = false;
        }
    }

    moveW(board: Array<Array<Piece>>, startCoord: Array<number>, endCoord: Array<number>){

        this.wEnPassantXpos = null;
        let startSq = board[startCoord[1]][startCoord[0]];
        let endSq = board[endCoord[1]][endCoord[0]];
        let startColor = startSq.color;
        let endColor = endSq.color;
        let startType = startSq.type;
        let retBool = false;

            if (startType == "P"){
                if(startSq.ypos == 6 && endSq.ypos == 4 && startSq.xpos == endSq.xpos && endSq.color == 'X' && board[5][endSq.xpos].color =="X"){//if pawn hasnt moved and moving 1 or 2 forward and moving straight its good
                    this.wEnPassantXpos = startSq.xpos;//setting en passant flag for 1 turn
                    return true;
                }
                else if(startSq.ypos-1 == endSq.ypos && startSq.xpos == endSq.xpos && endSq.color == "X"){//pawn moving 1 forward
                    if(endSq.ypos==0){ this.promotionTimeBool = true }
                    return true;
                }
                else if((startSq.ypos-1 == endSq.ypos) && (endSq.xpos + 1 == startSq.xpos || endSq.xpos -1 == startSq.xpos) && endSq.color == "B"){//pawn capturing
                    if(endSq.ypos==0){ this.promotionTimeBool = true }
                    return true;
                }
                else if( endSq.ypos == 2 && (endSq.xpos + 1 == startSq.xpos || endSq.xpos - 1 == startSq.xpos) && this.bEnPassantXpos == endSq.xpos && endSq.color == "X"){ //pawn en passanting
                    this.enPassantFlag = true;//flag picked up in component to swap pieces appropraitely
                    return true;
                }
            }

            if(startType == "K"){
                if( endSq.ypos == 7 && endSq.xpos == 2 && this.castleBoolObj.QSideBCastleBool == true ){ //castling move BQ side
                    if(this.sqThreatened(2,7,"B") && this.board[7][2].type == "X" && this.sqThreatened(3,7,"B") && this.board[7][3].type =="X" && this.sqThreatened(4,7,"B")){//checking to make sure areas being castled through arent occupied or threatened
                        this.castleFlag = "WQ";
                        return true
                    }
                }
                if( endSq.ypos == 7 && endSq.xpos == 6 && this.castleBoolObj.KSideBCastleBool == true){ //castling move BK side
                    if(this.sqThreatened(4,7,"B") && this.sqThreatened(5,7,"B") && this.board[7][5].type =="X" && this.sqThreatened(6,7,"B") && this.board[7][6].type=="X"){//checking to make sure areas being castled through arent occupied or threatened
                        this.castleFlag = "WK";
                        return true
                    }
                }

                if(Math.abs(startSq.ypos - endSq.ypos) < 2 && Math.abs(startSq.xpos - endSq.xpos) < 2 && endSq.color != "W" && this.sqThreatened(endCoord[0],endCoord[1], "B")){ //normal move
                    return true;
                }
            }

            if(startType == "N"){
                if(Math.abs(startSq.ypos - endSq.ypos) + Math.abs(startSq.xpos - endSq.xpos)  == 3 && Math.abs(startSq.xpos - endSq.xpos) != 0 && Math.abs(startSq.ypos - endSq.ypos) != 0 && endSq.color != "W"){
                    return true;
                }
            }

            if(startType == "R"  && endSq.color != "W"){
                if(startSq.xpos == endSq.xpos ){//moving up or down
                    if(startSq.ypos > endSq.ypos){//up
                        
                        for(let k = startSq.ypos-1; k > endSq.ypos; k--){
                            if(board[k][startSq.xpos].type != 'X'){
                                return false;
                            }
                        }
                    }
                    else if (startSq.ypos < endSq.ypos){//down

                        for(let k = startSq.ypos + 1; k < endSq.ypos; k++){
                            if( board[k][startSq.xpos].type != "X" ){
                                return false;
                            }
                        }
                    }
                    return true;
                } 
                if(startSq.ypos == endSq.ypos){//moving left or right
                    if(startSq.xpos > endSq.xpos){//moving left

                        for(let k = startSq.xpos-1; k > endSq.xpos; k--){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }

                    }
                    else if(startSq.xpos < endSq.xpos){//moving right

                        for(let k = startSq.xpos + 1; k < endSq.xpos; k++){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }

            }

            if(startType == "B" && endSq.color != "W"){
                if(Math.abs(endSq.xpos - startSq.xpos) - Math.abs(endSq.ypos - startSq.ypos) == 0){

                    if(endSq.xpos > startSq.xpos && endSq.ypos > startSq.ypos){//moving down right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[endSq.ypos - k][endSq.xpos - k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos > startSq.xpos && endSq.ypos < startSq.ypos){//moving up right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[startSq.ypos - k][startSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos > startSq.ypos){//moving down left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[startSq.ypos + k][startSq.xpos -k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos < startSq.ypos){//moving up left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[endSq.ypos + k][endSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }

            if(startType =="Q" && endSq.color != "W"){
                if(startSq.xpos == endSq.xpos ){//moving up or down
                    if(startSq.ypos > endSq.ypos){//up
                        
                        for(let k = startSq.ypos-1; k > endSq.ypos; k--){
                            if(board[k][startSq.xpos].type != 'X'){
                                return false;
                            }
                        }
                    }
                    else if (startSq.ypos < endSq.ypos){//down

                        for(let k = startSq.ypos + 1; k < endSq.ypos; k++){
                            if( board[k][startSq.xpos].type != "X" ){
                                return false;
                            }
                        }
                    }
                    return true;
                } 
                if(startSq.ypos == endSq.ypos){//moving left or right
                    if(startSq.xpos > endSq.xpos){//moving left

                        for(let k = startSq.xpos-1; k > endSq.xpos; k--){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }

                    }
                    else if(startSq.xpos < endSq.xpos){//moving right

                        for(let k = startSq.xpos + 1; k < endSq.xpos; k++){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }

                if(Math.abs(endSq.xpos - startSq.xpos) - Math.abs(endSq.ypos - startSq.ypos) == 0){

                    if(endSq.xpos > startSq.xpos && endSq.ypos > startSq.ypos){//moving down right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[endSq.ypos - k][endSq.xpos - k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos > startSq.xpos && endSq.ypos < startSq.ypos){//moving up right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[startSq.ypos - k][startSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos > startSq.ypos){//moving down left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[startSq.ypos + k][startSq.xpos -k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos < startSq.ypos){//moving up left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[endSq.ypos + k][endSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }
    }

    moveB(board: Array<Array<Piece>>, startCoord: Array<number>, endCoord: Array<number>){

        this.bEnPassantXpos = null;
        let startSq = board[startCoord[1]][startCoord[0]];
        let endSq = board[endCoord[1]][endCoord[0]];
        let startColor = startSq.color;
        let endColor = endSq.color;
        let startType = startSq.type;
        let retBool = false;

            if (startType == "P"){
                if(startSq.ypos == 1 && endSq.ypos == 3 && startSq.xpos == endSq.xpos && endSq.color =='X' && board[2][startSq.xpos].color == "X" ){//if pawn hasnt moved and moving 1 or 2 forward and moving straight its good
                    this.bEnPassantXpos = endSq.xpos;
                    return true;
                }
                else if(startSq.ypos+1 == endSq.ypos && startSq.xpos == endSq.xpos && endSq.color == "X"){
                    if(endSq.ypos==7){ this.promotionTimeBool = true }
                    return true;
                }
                else if((startSq.ypos+1 == endSq.ypos) && (endSq.xpos + 1 == startSq.xpos || endSq.xpos -1 == startSq.xpos) && endSq.color == "W"){
                    if(endSq.ypos==7){ this.promotionTimeBool = true }
                    return true;
                }
                else if( endSq.ypos == 5 && (endSq.xpos + 1 == startSq.xpos || endSq.xpos - 1 == startSq.xpos) && this.wEnPassantXpos == endSq.xpos && endSq.color == "X"){ //pawn en passanting
                    this.enPassantFlag = true;//flag picked up in component to swap pieces appropraitely
                    return true;
                }
                //else if(){}
            }

            if(startType == "K"){
                if( endSq.ypos == 0 && endSq.xpos == 2 && this.castleBoolObj.QSideBCastleBool == true ){ //castling move BQ side
                    if(this.sqThreatened(2,0,"W") && this.board[0][2].type == "X" && this.sqThreatened(3,0,"W") && this.board[0][3].type =="X" && this.sqThreatened(4,0,"W")){//checking to make sure areas being castled through arent occupied or threatened
                        this.castleFlag = "BQ";
                        return true
                    }
                }
                if( endSq.ypos == 0 && endSq.xpos == 6 && this.castleBoolObj.KSideBCastleBool == true){ //castling move BK side
                    if(this.sqThreatened(4,0,"W") && this.sqThreatened(5,0,"W") && this.board[0][5].type =="X" && this.sqThreatened(6,0,"W") && this.board[0][6].type=="X"){//checking to make sure areas being castled through arent occupied or threatened
                        this.castleFlag = "BK";
                        return true
                    }
                }

                if(Math.abs(startSq.ypos - endSq.ypos) < 2 && Math.abs(startSq.xpos - endSq.xpos) < 2 && endSq.color != "B" && this.sqThreatened(endCoord[0],endCoord[1], "W")){//normal move
                    return true;
                }
            }

            if(startType == "N"){
                if(Math.abs(startSq.ypos - endSq.ypos) + Math.abs(startSq.xpos - endSq.xpos)  == 3 && Math.abs(startSq.xpos - endSq.xpos) != 0 && Math.abs(startSq.ypos - endSq.ypos) != 0 && endSq.color != "B"){
                    return true;
                }
            }

            if(startType == "R"  && endSq.color != "B"){
                if(startSq.xpos == endSq.xpos ){//moving up or down
                    if(startSq.ypos > endSq.ypos){//up
                        
                        for(let k = startSq.ypos-1; k > endSq.ypos; k--){
                            if(board[k][startSq.xpos].type !='X'){
                                return false;
                            }
                        }
                    }
                    else if (startSq.ypos < endSq.ypos){//down

                        for(let k = startSq.ypos + 1; k < endSq.ypos; k++){
                            if( board[k][startSq.xpos].type !='X' ){
                                return false;
                            }
                        }
                    }
                    return true;
                } 
                if(startSq.ypos == endSq.ypos){//moving left or right
                    if(startSq.xpos > endSq.xpos){//moving left

                        for(let k = startSq.xpos-1; k > endSq.xpos; k--){
                            if(board[startSq.ypos][k].type !='X'){
                                return false;
                            }
                        }

                    }
                    else if(startSq.xpos < endSq.xpos){//moving right

                        for(let k = startSq.xpos + 1; k < endSq.xpos; k++){
                            if(board[startSq.ypos][k].type !='X'){
                                return false;
                            }
                        }

                    }
                    return true
                }
            }

            if(startType == "B" && endSq.color != "B"){
                if(Math.abs(endSq.xpos - startSq.xpos) - Math.abs(endSq.ypos - startSq.ypos) == 0){

                    if(endSq.xpos > startSq.xpos && endSq.ypos > startSq.ypos){//moving down right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[endSq.ypos - k][endSq.xpos - k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos > startSq.xpos && endSq.ypos < startSq.ypos){//moving up right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[startSq.ypos - k][startSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos > startSq.ypos){//moving down left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[startSq.ypos + k][startSq.xpos -k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos < startSq.ypos){//moving up left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[endSq.ypos + k][endSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }

            if(startType =="Q" && endSq.color != "B"){
                if(startSq.xpos == endSq.xpos ){//moving up or down
                    if(startSq.ypos > endSq.ypos){//up
                        
                        for(let k = startSq.ypos-1; k > endSq.ypos; k--){
                            if(board[k][startSq.xpos].type != 'X'){
                                return false;
                            }
                        }
                    }
                    else if (startSq.ypos < endSq.ypos){//down

                        for(let k = startSq.ypos + 1; k < endSq.ypos; k++){
                            if( board[k][startSq.xpos].type != "X" ){
                                return false;
                            }
                        }
                    }
                    return true;
                } 
                if(startSq.ypos == endSq.ypos){//moving left or right
                    if(startSq.xpos > endSq.xpos){//moving left

                        for(let k = startSq.xpos-1; k > endSq.xpos; k--){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }

                    }
                    else if(startSq.xpos < endSq.xpos){//moving right

                        for(let k = startSq.xpos + 1; k < endSq.xpos; k++){
                            if(board[startSq.ypos][k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }

                if(Math.abs(endSq.xpos - startSq.xpos) - Math.abs(endSq.ypos - startSq.ypos) == 0){

                    if(endSq.xpos > startSq.xpos && endSq.ypos > startSq.ypos){//moving down right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[endSq.ypos - k][endSq.xpos - k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos > startSq.xpos && endSq.ypos < startSq.ypos){//moving up right

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k > 0; k--){
                            if(board[startSq.ypos - k][startSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos > startSq.ypos){//moving down left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[startSq.ypos + k][startSq.xpos -k].type != "X"){
                                return false;
                            }
                        }
                    }

                    if(endSq.xpos < startSq.xpos && endSq.ypos < startSq.ypos){//moving up left

                        for(let k = Math.abs(endSq.xpos - startSq.xpos)-1; k>0; k--){
                            if(board[endSq.ypos + k][endSq.xpos + k].type != "X"){
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }
    }

    originalColor(xpos, ypos){ //returns string representation of the background color each square should e
        if((xpos + ypos) % 2 ==0){
            return "white";
        }
        else{
            return "lightskyblue";
        }
    }

    /* sqThreatened
        @params: xpos: checks if square is threatened at that xPosition
                 ypos: checks if square is threatened at that yPosition
                 oppoColor: supplies a color, checks pieces threatening the square provided, of the supplied color
        @returns: FALSE IF SQUARE IS THREATENED, TRUE IF SQUARE IS SAFE
    */
    sqThreatened(xpos, ypos, oppoColor, includingKingThreaten = true){//returns false if a square if being threatened by an opposing piece

        this.blockObj.attackingColor = null;
        this.blockObj.attackingType = null;
        this.blockObj.attackingXpos = null;
        this.blockObj.attackingYpos = null;

        let sameColor = "";
        oppoColor == "W" ? sameColor == "B" : sameColor == "W" //set same color

        if(oppoColor == "W"){//checking pawn and setting opposite color at the same time

            if(xpos == 7){
                if((this.board[ypos+1][xpos-1].type == "P" && this.board[ypos+1][xpos-1].color == oppoColor)){

                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos+1][xpos-1].type;
                    this.blockObj.attackingXpos = xpos-1;
                    this.blockObj.attackingYpos = ypos+1;

                    return false;
                }
            }
            else if(xpos == 0){
                if((this.board[ypos+1][xpos+1].type == "P" && this.board[ypos+1][xpos+1].color == oppoColor)){
                    
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos+1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos+1;
                    this.blockObj.attackingYpos = ypos+1;

                    return false;
                }
            }
            else{
                if(this.board[ypos+1][xpos+1].type == "P" && this.board[ypos+1][xpos+1].color == oppoColor){
                                        
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos+1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos+1;
                    this.blockObj.attackingYpos = ypos+1;

                    return false;
                }

                else if (this.board[ypos+1][xpos-1].type == "P" && this.board[ypos+1][xpos-1].color == oppoColor){
                                        
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos+1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos-1;
                    this.blockObj.attackingYpos = ypos+1;

                    return false
                }
            }
        }

        else{//is whites turn so black is the opposite color to look for
            if(xpos == 7){
                if((this.board[ypos-1][xpos-1].type == "P" && this.board[ypos-1][xpos-1].color == oppoColor)){
                    
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos-1][xpos-1].type;
                    this.blockObj.attackingXpos = xpos-1;
                    this.blockObj.attackingYpos = ypos-1;

                    return false;
                }
            }
            else if(xpos == 0){
                if((this.board[ypos-1][xpos+1].type == "P" && this.board[ypos-1][xpos+1].color == oppoColor)){
                    
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos-1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos+1;
                    this.blockObj.attackingYpos = ypos-1;

                    return false;
                }
            }
            else{
                if(this.board[ypos-1][xpos+1].type == "P" && this.board[ypos-1][xpos+1].color == oppoColor){
                                        
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos-1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos+1;
                    this.blockObj.attackingYpos = ypos-1;

                    return false;
                }

                else if(this.board[ypos-1][xpos-1].type == "P" && this.board[ypos-1][xpos-1].color == oppoColor){
                                        
                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = this.board[ypos-1][xpos+1].type;
                    this.blockObj.attackingXpos = xpos+1;
                    this.blockObj.attackingYpos = ypos-1;

                    return false;
                }
            }
        }

        for(let i =0; i < 8; i++){//knight check
            if( ypos + this.knightArray[i][0] > 0 && ypos + this.knightArray[i][0] < 8 && xpos + this.knightArray[i][1] < 8 && xpos + this.knightArray[i][1] > 0){
                let square = this.board[ ypos + this.knightArray[i][0] ][ xpos + this.knightArray[i][1] ];
                //square.squareColor = "red";

                if(square.type == "N" && square.color == oppoColor){

                    this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                    this.blockObj.attackingType = square.type;
                    this.blockObj.attackingXpos = square.xpos;
                    this.blockObj.attackingYpos = square.ypos;

                    return false;
                }
            }
        }

        if(includingKingThreaten == true){
            for(let i=0; i<8; i++){//king check
                if( ypos + this.kingArray[i][0] > 0 && ypos + this.kingArray[i][0] < 8 && xpos + this.kingArray[i][1] < 8 && xpos + this.kingArray[i][1] > 0){
                    let square = this.board[ ypos + this.kingArray[i][0] ][ xpos + this.kingArray[i][1] ];

                    if(square.type == "K" && square.color == oppoColor){
                        return false;
                    }
                }
            }
        }
        //rook check and partial queen check
        for(let i = 1; i < 8; i++){//up
            if(ypos-i >= 0){

                if(this.board[ypos-i][xpos].type == "K" && this.board[ypos-i][xpos].color == sameColor){
                    continue
                }

                if( this.board[ypos-i][xpos].type != "X"  ){        //|| (this.board[ypos-i][xpos].type != "K" && this.board[ypos-i][xpos].color != oppoColor)
                    if( (this.board[ypos-i][xpos].type == "R" || this.board[ypos-i][xpos].type == "Q") && this.board[ypos-i][xpos].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos-i][xpos].type;
                        this.blockObj.attackingXpos = xpos;
                        this.blockObj.attackingYpos = ypos-i;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//down
            if(ypos+i < 8){

                if(this.board[ypos+i][xpos].type == "K" && this.board[ypos+i][xpos].color == sameColor){
                    continue
                }

                if( this.board[ypos+i][xpos].type != "X" ){         // || (this.board[ypos+i][xpos].type != "K" && this.board[ypos+i][xpos].color != oppoColor) 
                    if( (this.board[ypos+i][xpos].type == "R" || this.board[ypos+i][xpos].type == "Q") && this.board[ypos+i][xpos].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos+i][xpos].type;
                        this.blockObj.attackingXpos = xpos;
                        this.blockObj.attackingYpos = ypos+i;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//left
            if(xpos-i >= 0){
                if( this.board[ypos][xpos-i].type != "X"){
                    if( (this.board[ypos][xpos-i].type == "R" || this.board[ypos][xpos-i].type == "Q") && this.board[ypos][xpos-i].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos][xpos-i].type;
                        this.blockObj.attackingXpos = xpos-i;
                        this.blockObj.attackingYpos = ypos;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//right
            if(xpos + i  < 8){
                if( this.board[ypos][xpos+i].type != "X"){
                    if( (this.board[ypos][xpos+i].type == "R" || this.board[ypos][xpos+i].type == "Q") && this.board[ypos][xpos+i].color == oppoColor){
                        
                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos][xpos+i].type;
                        this.blockObj.attackingXpos = xpos+i;
                        this.blockObj.attackingYpos = ypos;

                        return false
                    }
                    break;
                }
            }
        }

        //bishop  and partial queen check
        for(let i = 1; i < 8; i++){//down-right
            if(xpos + i  < 8 && ypos + i < 8){
                if( this.board[ypos+i][xpos+i].type != "X"){
                    if( (this.board[ypos+i][xpos+i].type == "B" || this.board[ypos+i][xpos+i].type == "Q") && this.board[ypos+i][xpos+i].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos+i][xpos+i].type;
                        this.blockObj.attackingXpos = xpos+i;
                        this.blockObj.attackingYpos = ypos+i;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//up-right
            if(xpos + i  < 8 && ypos - i > 0){
                if( this.board[ypos-i][xpos+i].type != "X"){
                    if( (this.board[ypos-i][xpos+i].type == "B" || this.board[ypos-i][xpos+i].type == "Q") && this.board[ypos-i][xpos+i].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos-i][xpos+i].type;
                        this.blockObj.attackingXpos = xpos+i;
                        this.blockObj.attackingYpos = ypos-i;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//up-left
            if(xpos - i  > 0 && ypos - i > 0){
                if( this.board[ypos-i][xpos-i].type != "X"){
                    if( (this.board[ypos-i][xpos-i].type == "B" || this.board[ypos-i][xpos-i].type == "Q") && this.board[ypos-i][xpos-i].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos-i][xpos-i].type;
                        this.blockObj.attackingXpos = xpos-i;
                        this.blockObj.attackingYpos = ypos-i;

                        return false
                    }
                    break;
                }
            }
        }
        for(let i = 1; i < 8; i++){//down-left
            if(xpos - i > 0 && ypos + i < 8){
                if( this.board[ypos+i][xpos-i].type != "X"){
                    if( (this.board[ypos+i][xpos-i].type == "B" || this.board[ypos+i][xpos-i].type == "Q") && this.board[ypos+i][xpos-i].color == oppoColor){

                        this.blockObj.attackingColor = oppoColor; //setting blockObj so canBeBlocked can tell if a potential checkmate can be blocked
                        this.blockObj.attackingType = this.board[ypos+i][xpos-i].type;
                        this.blockObj.attackingXpos = xpos-i;
                        this.blockObj.attackingYpos = ypos+i;

                        return false
                    }
                    break;
                }
            }
        }
        return true;
    }

    checkSafeWKing(){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if (this.board[j][i].type == "K" && this.board[j][i].color =="W"){
                    return this.sqThreatened(i,j, "B");
                }
            }
        }
    }

    checkSafeBKing(){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if (this.board[j][i].type == "K" && this.board[j][i].color =="B"){
                    return this.sqThreatened(i,j, "W");
                }
            }
        }
    }

    performCastle(){//uses castleFlag that was set in moveW and moveB when determining if move is valid to see which castle is up, and swaps the correct pieces.

        if(this.castleFlag == "WK"){
            this.board[7][6] = new Piece(7,6,"K","W");
            this.board[7][5] = new Piece(7,5,"R","W");
            this.board[7][4] = new Piece(7,4,"X","X");
            this.board[7][7] = new Piece(7,7,"X","X");
        }
        else if(this.castleFlag == "WQ"){
            this.board[7][0] = new Piece(7,0,"X","X");
            this.board[7][2] = new Piece(7,2,"K","W");
            this.board[7][3] = new Piece(7,3,"R",'W');
            this.board[7][4] = new Piece(7,4,"X","X");
        }
        else if(this.castleFlag == "BK"){
            this.board[0][6] = new Piece(0,6,"K","B");
            this.board[0][5] = new Piece(0,5,"R","B");
            this.board[0][4] = new Piece(0,4,"X","X");
            this.board[0][7] = new Piece(0,7,"X","X");
        }
        else if(this.castleFlag == "BQ"){
            this.board[0][0] = new Piece(0,0,"X","X");
            this.board[0][2] = new Piece(0,2,"K","B");
            this.board[0][3] = new Piece(0,3,"R",'B');
            this.board[0][4] = new Piece(0,4,"X","X");
        }
        this.castleFlag = null;
        this.castleBoolObj.QSideWCastleBool = false;
    }

    performEnPassant(startYpos: number, startXpos: number){  // called if castleFlag is true, swaps appropriate pieces and resets flags
        if(this.wEnPassantXpos !== null){ //B performing en passant

            this.board[startYpos][startXpos] = new Piece(startXpos, startYpos, "X", "X");
            this.board[5][this.wEnPassantXpos] = new Piece(this.wEnPassantXpos, 5, "P", "B");
            this.board[4][this.wEnPassantXpos] = new Piece(this.wEnPassantXpos, 4, "X", "X");
            this.wEnPassantXpos = null;
            this.enPassantFlag = false;

        }
        else if(this.bEnPassantXpos !== null){ // W performing en passant

            // this.board[3][startXpos] = new Piece(startXpos, 3, "X", "X");
            // this.board[2][this.bEnPassantXpos] = new Piece(this.bEnPassantXpos, 2, "P", "W");
            // this.board[3][this.bEnPassantXpos] = new Piece(this.bEnPassantXpos, 3, "X", "X");
            this.board[3][startXpos] = new Piece(3, startXpos, "X", "X");
            this.board[2][this.bEnPassantXpos] = new Piece(2, this.bEnPassantXpos, "P", "W");
            this.board[3][this.bEnPassantXpos] = new Piece(3, this.bEnPassantXpos,  "X", "X");
            this.bEnPassantXpos = null;
            this.enPassantFlag = false;
        }   


    }

    //returns true if a King of that color is in checkmate
    checkCheckmate(color: string){
        //Checks if a certain King is in checkmate, ending the game
        //In order to be Checkmated: 
        //      King has to be in check && All the possible square the King could move are either filled with sameColor Pieces, or threatened by enemy pieces

        let checkMateBool = true;
        let oppoColor = "";
        color == "W" ? oppoColor = "B" : oppoColor ="W";

        let kSquare: Piece = null;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if (this.board[j][i].type == "K" && this.board[j][i].color == color){
                    kSquare = this.board[j][i];
                }
            }
        }

        if(this.sqThreatened(kSquare.xpos, kSquare.ypos, oppoColor) == true){//if King is not being threatened, return false automatically
            return false;
        }

        if(this.canBeBlocked(kSquare.xpos, kSquare.ypos, color)){//if check can be blocked by a piece of the same color, also return false, is not checkmate
            return false
        }

        for(let i=0; i<8; i++){//king check
            if( kSquare.ypos + this.kingArray[i][0] > 0 && kSquare.ypos + this.kingArray[i][0] < 8 && kSquare.xpos + this.kingArray[i][1] < 8 && kSquare.xpos + this.kingArray[i][1] > 0){
                let square = this.board[ kSquare.ypos + this.kingArray[i][0] ][ kSquare.xpos + this.kingArray[i][1] ];
                if(this.sqThreatened(square.xpos, square.ypos, oppoColor) == false || this.board[square.ypos][square.xpos].color == color){
                    checkMateBool = true;
                }
                else{
                    return false;
                }
            }
        }
        return checkMateBool;
    }

    //returns true if a check/mate can be blocked by a piece of the same color
    canBeBlocked(kXpos: number , kYpos: number , blockingColor: string){

        let funcBlockObj = {
            attackingColor: this.blockObj.attackingColor,
            attackingType: this.blockObj.attackingType,
            attackingXpos: this.blockObj.attackingXpos,
            attackingYpos: this.blockObj.attackigYpos
        }

        let oppoColor = "";
        blockingColor == "W" ? oppoColor = "B" : oppoColor = "W";

        let absXdif = Math.abs(kXpos - funcBlockObj.attackingXpos);
        let absYdif = Math.abs(kYpos - funcBlockObj.attackingYpos);

        if(funcBlockObj.attackingType = null){//if this is null, the piece checking King is a king??, so it cannot be blocked
            return false
        }

        else{//else, is a B/Q/R/N/P, and is not right next to piece

            if(funcBlockObj.attackingType == "N" || funcBlockObj.attackingType == "P"){ //if pawn or knight are attacking, they can be "blocked" by being taken, in which case isnt checkmate
                if(this.sqThreatened(funcBlockObj.attackingXpos, funcBlockObj.attackingYpos, oppoColor, false) == false){
                    return true;
                }
            }

            if(absXdif == 0){ //piece is being attacked from a straight up/down
                if(kYpos > funcBlockObj.attackingYpos){ //king is being attacking from up
                    for(let i = funcBlockObj.attackingYpos; i < kYpos; i++){
                        if(this.sqThreatened(kXpos, i, blockingColor, false) == false){
                            return true;
                        }
                    }
                }
                else if(kYpos < funcBlockObj.attackingYpos){// king being attacking from down(ascending ypos)
                    for(let i = funcBlockObj.attackingYpos; i > kYpos; i--){
                        if(this.sqThreatened(kXpos, i, blockingColor, false) == false){
                            return true;
                        }
                    }
                }
            }
            else if(absYdif == 0){ // piece is being attacked from a straight left/right
                if(kXpos > funcBlockObj.attackingXpos){//K attacked from left(descending Xpositions)
                    for(let i = funcBlockObj.attackingXpos; i < kXpos; i++){
                        if(this.sqThreatened(kYpos, i, blockingColor, false) == false){
                            return true;
                        }
                    }
                }
                else if(kXpos < funcBlockObj.attackingXpos){//K attacked from right(ascending Xpositions)
                    for(let i = funcBlockObj.attackingXpos; i > kXpos; i++){
                        if(this.sqThreatened(kYpos, i, blockingColor, false) == false){
                            return true;
                        }
                    }
                }
            }

            else if(absXdif > 1 && absYdif > 1){ //piece is being attacked diagonally
                
                if( kYpos > funcBlockObj.attackingYpos && kXpos < funcBlockObj.attackingXpos ){ // up right
                    for(let i = 0; i < absXdif; i++){
                        if(this.sqThreatened(funcBlockObj.attackingXpos - i, funcBlockObj.attackingYpos + i, blockingColor, false) == false){
                            return true;
                        }
                    }
                }

                if( kYpos > funcBlockObj.attackingYpos && kXpos > funcBlockObj.attackingXpos ){ // up left
                    for(let i = 0; i < absXdif; i++){
                        if(this.sqThreatened(funcBlockObj.attackingXpos - i, funcBlockObj.attackingYpos - i, blockingColor, false) == false){
                            return true;
                        }
                    }
                } 

                if( kYpos < funcBlockObj.attackingYpos && kXpos < funcBlockObj.attackingXpos ){ // down right
                    for(let i = 0; i < absXdif; i++){
                        if(this.sqThreatened(funcBlockObj.attackingXpos + i, funcBlockObj.attackingYpos + i, blockingColor, false) == false){
                            return true;
                        }
                    }
                } 

                if( kYpos < funcBlockObj.attackingYpos && kXpos > funcBlockObj.attackingXpos){ // down left
                    for(let i = 0; i < absXdif; i++){
                        if(this.sqThreatened(funcBlockObj.attackingXpos + i, funcBlockObj.attackingYpos - i, blockingColor, false) == false){
                            return true;
                        }
                    }
                } 
            }
        }
    }
}

export class Piece{

    xpos: number; //0 to 7
    ypos: number; //0 to 7
    type: string; //ARNBQK
    color: string; //W or B
    squareColor: string; //any css color

    constructor(y:number, x:number, type:string, color:string){

        this.ypos = y;
        this.xpos = x;
        this.type = type;
        this.color = color;
        this.squareColor = this.originalColor(x, y);
    }

    originalColor(xpos, ypos){ //returns string representation of the background color each square should e
        if((xpos + ypos) % 2 ==0){
            return "white";
        }
        else{
            return "lightskyblue";
        }
    }
}