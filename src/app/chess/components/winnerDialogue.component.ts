import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'winnerDialogue',
    templateUrl: '../views/winnerDialogue.component.html',
    styleUrls: ['../views/chess.component.css']
})

export class winnerDialogueComponent implements OnChanges{

    @Input() winner: string;
    @Output() resetBool = new EventEmitter<boolean>();
    winnerFullString: string; 

    constructor(){
        this.winner == "W" ? this.winnerFullString ="White" : this.winnerFullString ="Black";
    }

    ngOnChanges(){
        this.winner == "W" ? this.winnerFullString ="White" : this.winnerFullString ="Black";
    }

    newGame(){
        console.log("in winner dialogue new game button new game function, reseting board")
        this.resetBool.emit(true);
    }


}