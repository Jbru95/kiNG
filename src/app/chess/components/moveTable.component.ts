import { Component } from '@angular/core';

export interface MoveTableRow {
    turn: number;
    wMove: string;
    bMove: string;
}

const TestData: MoveTableRow[] = [
    {turn: 1, wMove: 'e4', bMove: 'e5'},
    {turn: 2, wMove: 'd4', bMove: 'd5'},
    {turn: 3, wMove: 'Ne5', bMove: 'Nf6'},
    {turn: 1, wMove: 'e4', bMove: 'e5'},
    {turn: 2, wMove: 'd4', bMove: 'd5'},
    {turn: 3, wMove: 'Ne5', bMove: 'Nf6'},
    {turn: 1, wMove: 'e4', bMove: 'e5'},
    {turn: 2, wMove: 'd4', bMove: 'd5'},
    {turn: 3, wMove: 'Ne5', bMove: 'Nf6'}
];
@Component({
    templateUrl: '../views/moveTable.component.html',
    selector: 'moveTable',
    styleUrls: ['../views/chess.component.css']
})

export class MoveTableComponent{
    dataSource = TestData;
    displayedColumns: string[] = ['turn', 'wMove', 'bMove'];
}