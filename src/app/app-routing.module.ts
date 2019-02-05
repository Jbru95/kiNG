import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChessComponent } from './chess/components/chess.component';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    {path: 'chess', component: ChessComponent}
    // add new paths here
];

@NgModule({

    imports: [RouterModule.forRoot(appRoutes)], 
    declarations: [],
    providers: [],
    exports: [RouterModule]
})
 
export class AppRoutingModule{}
export const routingComponents = [ChessComponent];// Add new components here