import { Component, OnChanges, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';

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

export class MoveTableComponent implements OnChanges{
    
    @Input() nextObj: MoveTableRow;
    @ViewChild(MatTable) table: MatTable<MoveTableRow>;
    @Input() currentRowObj: any;

    dataSource: MoveTableRow[] = [];
    displayedColumns: string[] = ['turn', 'wMove', 'bMove'];
    lastObj: MoveTableRow;


    constructor(){
        this.dataSource = [];
    }

    ngOnChanges(){
        console.log('in moveTable changes,  currentRowObj: ', this.currentRowObj, ' , nextObj: ', this.nextObj);
        if ( this.nextObj != undefined && this.nextObj != this.lastObj ) {
            console.log('pushing nextObj onto table data');
            if ( this.dataSource.length == 0 ) {
                this.dataSource.push(this.nextObj);    
            }
            else if ( this.dataSource[0].bMove == null ) {
                this.dataSource[0].bMove = this.nextObj.bMove;
            }
            else {
                this.dataSource.push(this.nextObj);   
            }
            this.dataSource.sort((obj1, obj2) => obj2.turn - obj1.turn);
            this.table.renderRows();
            this.lastObj = this.nextObj;
        }
    }
}