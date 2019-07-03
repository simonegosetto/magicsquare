import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../core/services/global.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.page.html',
  styleUrls: ['./multiplayer.page.scss'],
})
export class MultiplayerPage implements OnInit {

  constructor(private _gs: GlobalService,
              private _router: Router,
              private _route: ActivatedRoute) { }

  //
  // Private
  //
  private matchID;

  //
  // Public
  //
  public opponent = null;

  ngOnInit() {
    this.matchID = this._route.snapshot.paramMap.get('gameid');
    this.getDetails();
  }

  getDetails() {
      this._gs.callGateway('D+fl2FoyYyZYa9Kfsens6E0Ce/dQxPh1Sw6P//zaTrItWy0tSVYtWy2V4hgAMEqyFbLwCbY7w43os/iRLD2Zb3i46Wc0U/lUDw@@',
          this.matchID + ',\'' + this._gs.uuid() + '\'', false).subscribe(data => {
              if (data.hasOwnProperty('error')) {
                  this._gs.toast.present(data.error);
                  this._router.navigateByUrl('home');
                  return;
              }
              this.opponent = {...data.recordset[0]};
          },
          error => this._gs.toast.present(error.message, 5000));
  }

}
