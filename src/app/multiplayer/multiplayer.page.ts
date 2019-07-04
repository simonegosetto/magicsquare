import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../core/services/global.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Square} from '../core/components/game/square/square';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.page.html',
  styleUrls: ['./multiplayer.page.scss'],
})
export class MultiplayerPage implements OnInit, OnDestroy {

  constructor(private _gs: GlobalService,
              private _router: Router,
              private _route: ActivatedRoute) { }

    //
    // Private
    //
    private matchID;
    private matchOwn = {
        finish: 0,
        points: 0
    };
    private timeOutGame = null;

    //
    // Public
    //
    public opponent = null;

    ngOnInit() {
        this.matchID = this._route.snapshot.paramMap.get('gameid');
        this.getDetails();
    }

    ngOnDestroy() {
        clearTimeout(this.timeOutGame);
    }

    getDetails() {
      clearTimeout(this.timeOutGame);
      this._gs.callGateway('D+fl2FoyYyZYa9Kfsens6E0Ce/dQxPh1Sw6P//zaTrItWy0tSVYtWy2V4hgAMEqyFbLwCbY7w43os/iRLD2Zb3i46Wc0U/lUDw@@',
          this.matchID + ',\'' + this._gs.uuid() + '\'', false).subscribe(data => {
              if (data.hasOwnProperty('error')) {
                  this._gs.toast.present(data.error);
                  this._router.navigateByUrl('home');
                  return;
              }
              this.opponent = {...data.recordset[0]};
              if (this.opponent.finish === 1) {
                this.checkGameFinished();
              } else {
                  this.timeOutGame = setTimeout(() => this.getDetails(), 2000);
              }
          },
          error => {
              this._gs.toast.present(error.message, 5000);
              this.timeOutGame = setTimeout(() => this.getDetails(), 2000);
          });
    }

    scoreChange(squareClicked: Square) {
        this._gs.callGateway('Np+lHDaWGdny3dnlAbvgUsv6H207iJiItUvIrYEXwvEtWy0tSVYtWy1rruDyrU4qF071gGIG4T02z0fNQxuv8UtfCrSUegXJjQ@@',
            squareClicked.x + ',' + squareClicked.y + ',\'' + this._gs.uuid() + '\',' + this.matchID, false).subscribe(data => {
                if (data.hasOwnProperty('error')) {
                    this._gs.toast.present(data.error);
                    return;
                }
            },
            error => this._gs.toast.present(error.message, 5000));
    }

    sendOwnFinish() {
        this._gs.callGateway('pBOHUBsNB9XG7UV4gFl+ZcRacub7miydSldSyI+j6vAtWy0tSVYtWy2GiZ7h71u/NFrZlkzQkt52P3AdSHz5F1DIV7yVih6iDw@@',
            '\'' + this._gs.uuid() + '\',' + this.matchID, false).subscribe(data => {
                if (data.hasOwnProperty('error')) {
                    this._gs.toast.present(data.error);
                    return;
                }
                const { finish, points } = data.recordset[0];
                this.matchOwn = { finish, points };
                this.checkGameFinished();
            },
            error => this._gs.toast.present(error.message, 5000));
    }

    checkGameFinished() {
        let message = 'YOU ';
        let color: string;
        if (this.matchOwn.finish === 1 && this.opponent.finish === 1) {
            if (this.matchOwn.points > this.opponent.points) {
                message += 'WON !';
                color = 'success';
            } else if (this.matchOwn.points === this.opponent.points) {
                message += 'DREW !';
                color = 'medium';
            } else {
                message += 'LOST !';
                color = 'danger';
            }
            this._gs.toast.present(message, 0, true, color).then(() => this._router.navigateByUrl('home'));
        }
    }

}
