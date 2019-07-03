import {Component, Input, OnInit} from '@angular/core';
import {Square} from './square/square';
import {ToastService} from '../../services/toast.service';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from '../../services/global.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

    constructor(
        private toast: ToastService,
        private http: HttpClient,
        public gs: GlobalService
    ) { }

    @Input() multiplayer = false;
    @Input() opponent = { uuid: '', points: 0 };

    //
    // Private
    //
    private squarePrev: Square;
    private squareCoordinates = {};

    //
    // Public
    //
    public squaresRows = [];

    //
    // Method
    //

    ngOnInit() {
        this.gameInit();
    }

    squareCounter(): number {
        if (this.squaresRows) {
            let count = 0;
            this.squaresRows.forEach((row) => {
                row.forEach((col: Square) => {
                    count += col.clicked ? 1 : 0;
                });
            });
            return count;
        } else {
            return 0;
        }
    }

    squareClick(squareClicked: Square) {
        console.log('cliccato su ', squareClicked);
        if (!squareClicked.clicked) {
            if (this.squarePrev === undefined) {
                squareClicked.clicked = true;
                this.squarePrev = {...squareClicked} as Square;
            } else {
                const xyPrev = this.squarePrev.x.toString() + this.squarePrev.y.toString();
                const xyCurrent = squareClicked.x.toString() + squareClicked.y.toString();
                const isPossible = this.squareCoordinates[xyPrev].filter(c => c === xyCurrent);
                if (isPossible.length > 0) {
                    squareClicked.clicked = true;
                    this.squarePrev = {...squareClicked} as Square;

                    // controllo se posso fare altre mosse o meno
                    this.gameCheckIfFinisched(squareClicked);
                }
            }
        }
    }

    gameCheckIfFinisched(squareClicked) {
        if (this.isFinished(squareClicked)) {
            this.toast.present('Finito con ' + this.squareCounter() + ' punti !').then(() => this.gameReset());
        }
    }

    gameInit() {
        this.squarePrev = undefined;
        this.squaresRows = [
            [], [], [], [], [], [], [], [], [], []
        ];
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                this.squaresRows[y].push({x: x + 1, y: y + 1, clicked: false});
            }
        }

        // leggo le coordinate per istruire il gioco sulle mosse possibili
        this.http.get('assets/data/coordinates.json').subscribe(data => {
            this.squareCoordinates = data;
        });
    }

    isFinished(squareCurrent: Square): boolean {
        let finish = true;
        const {x, y} = squareCurrent;
        const xyCurrent = x.toString() + y.toString();
        const movesPossible = this.squareCoordinates[xyCurrent];
        movesPossible.forEach(move => {
            this.squaresRows.forEach((row) => {
                row.forEach((col: Square) => {
                    const xyCol = col.x.toString() + col.y.toString();
                    if (move === xyCol && !col.clicked) {
                        finish = false;
                    }
                });
            });
        });
        return finish;
    }

    gameReset() {
        this.gameInit();
    }

}
