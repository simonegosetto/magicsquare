import {Component, Input} from '@angular/core';
import {Square} from './square';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent  {

    constructor() {}

    @Input() data: Square;
    @Input() dataPrev: Square;

    squareSelectPrev() {
        if (this.dataPrev) {
            const {x,y} = this.data;
            const {x: x2, y: y2} = this.dataPrev;
            if (x === x2 && y === y2) {
                return {
                    'background-color': '#aaa'
                };
            } else {
                return '';
            }
        }
    }

}
