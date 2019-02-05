import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'timer',
    templateUrl: '../views/timer.component.html',
    styleUrls: ['../views/chess.component.css']
})

export class timerComponent implements OnChanges{


    @Input() clockTime: string;
    @Input() addedTime: string;
    @Input() timerOn: boolean;
    @Input() timerChar: string;
    @Input() winner: string;
    whiteTimeDisplay: string;
    blackTimeDisplay: string;
    whiteSeconds: number = undefined;
    blackSeconds: number = undefined;
    whiteInterval: any;
    blackInterval: any;
    timeStart: boolean = false;
    

    constructor(){
        this.whiteSeconds = undefined;
    }

    ngOnChanges(){
        console.log("clockTime: ", this.clockTime, "timerOn: ", this.timerOn, "whiteSeconds: ", this.whiteSeconds);

        if(this.whiteSeconds == undefined && this.clockTime != '0'){
            this.whiteSeconds = parseInt(this.clockTime)*60;
            this.blackSeconds = parseInt(this.clockTime)*60;
            console.log('white and black seconds set to ', this.whiteSeconds);
        }

        this.updateDisplayTime();
        console.log(this.timerChar);
        this.startBlackTime();
        this.startWhiteTime();
    }

    startBlackTime(){
        if(this.timerOn == true && this.timerChar=="B"){
            clearInterval(this.whiteInterval);
            this.blackInterval = setInterval( interval => this.incrementTime("B"), 1000);
        }
    }

    startWhiteTime(){
        if(this.timerOn==true && this.timerChar=="W"){
            clearInterval(this.blackInterval);
            this.whiteInterval = setInterval( interval => this.incrementTime("W"), 1000);
        }
    }
    
    incrementTime( colorChar: string): void{
        if(colorChar == 'W'){
            this.whiteSeconds -= 1;
            this.updateDisplayTime();
        }
        else if(colorChar == "B"){
            this.blackSeconds -= 1;
            this.updateDisplayTime();
        }
    }

    updateDisplayTime(): void{
        this.whiteTimeDisplay = (Math.floor(this.whiteSeconds/60).toString() + ":" + (this.whiteSeconds%60).toString());
        this.blackTimeDisplay = (Math.floor(this.blackSeconds/60).toString() + ":" + (this.blackSeconds%60).toString());
    }

}