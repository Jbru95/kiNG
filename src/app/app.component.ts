import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '../../node_modules/@angular/router';
import { NgModel } from '@angular/forms';
import { ModeEnum } from "../app/chess/mode.enum";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  clockTimeArray = [1,2,5,10,20,30,60];
  addedTimeArray = [1,2,5,10];
  FENString: string = "test FENString";
  title = 'kiNG';
  chessDisplay: string ="none";
  setupDisplay: string ="block";

  settingsModel = {
    clockTime: 0,
    addedTime: 0,
    mode: ModeEnum.TWO_PLAYER
  }

  constructor(private route: ActivatedRoute, private router: Router){}

  startGame(){
    this.setupDisplay = "none";
    this.chessDisplay = "block";
  }

  recieveBackEmit($event){
    console.log("in back emit, recieved: ", $event);
    this.chessDisplay ="none";
    this.setupDisplay ="block";
  }


  toChess(){
    this.router.navigate(['chess']);
    this.title = 'Chess';
  }

  toHome(){
    this.router.navigate(['']);
    this.title= 'Home';
  }
}
