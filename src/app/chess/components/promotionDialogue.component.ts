import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'promotionDialogue',
    templateUrl: '../views/promotionDialogue.component.html',
    styleUrls: ['../views/chess.component.css']
})

export class promotionDialogueComponent implements OnChanges{

    @Input() whiteTurnPromo: boolean;
    @Output() selectedPromotionEvent = new EventEmitter<string>();
    optionsArray: Array<string> = ["Q,R,B,K"];
    colorChar: string;

    constructor(){}

    ngOnChanges(){
        this.whiteTurnPromo == true ? this.colorChar ="W" : this.colorChar ="B";
    }

    selectPromotion(pieceStr: string){
        console.log(pieceStr, " in promodialogue component");
        this.selectedPromotionEvent.emit(pieceStr);
    }
}