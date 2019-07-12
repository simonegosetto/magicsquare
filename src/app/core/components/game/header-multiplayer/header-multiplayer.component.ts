import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-header-multiplayer',
  template: `
      <ion-row class="ion-padding" align-items-center>
          <ion-col [size]="3" class="ion-text-left">
              {{user?.nickname || user?.uuid}}<br>
              <ion-badge color="success" [hidden]="user?.finish !== 1">FINISHED</ion-badge>
          </ion-col>

          <ion-col [size]="2" class="ion-text-right"><h1>{{user?.points}}</h1></ion-col>
          <ion-col [size]="2" class="ion-text-center"><h1>:</h1></ion-col>
          <ion-col [size]="2" class="ion-text-left"><h1>{{opponent?.points}}</h1></ion-col>

          <ion-col [size]="3" class="ion-text-right">
              {{opponent?.uuid}}<br>
              <ion-badge color="secondary" [hidden]="opponent?.finish !== 1">FINISHED</ion-badge>
          </ion-col>
      </ion-row>
  `,
  styles: [],
})
export class HeaderMultiplayerComponent {

  @Input() user;
  @Input() opponent;

}
