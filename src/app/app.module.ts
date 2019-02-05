import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { ChessComponent } from './chess/components/chess.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { promotionDialogueComponent } from './chess/components/promotionDialogue.component';
import { winnerDialogueComponent } from './chess/components/winnerDialogue.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { timerComponent } from './chess/components/timer.component';
import { MoveTableComponent } from './chess/components/moveTable.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    ChessComponent,
    promotionDialogueComponent,
    winnerDialogueComponent,
    timerComponent,
    MoveTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
