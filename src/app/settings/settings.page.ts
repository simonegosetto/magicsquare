import { Component } from '@angular/core';
import { GlobalService } from '../core/services/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  {

  constructor(public gs: GlobalService) { }

  update(nicknameInput) {
    console.log(nicknameInput.value);
    this.gs.callGateway('T5Dgrnme7k9mFu4bAy2hIEwyWzsrNoiUsSVb9gfVYIItWy0tSVYtWy1GHtsweGukmbofYmCmCLL7LpRwma6otvbK78/Uakf9Ig@@',
        '\'' + localStorage.getItem('token') + '\',\'' + this.gs.isnull(nicknameInput.value) + '\'' , true)
        .subscribe(data => {
                if (data.hasOwnProperty('error')) {
                    this.gs.toast.present(data.error);
                    return;
                }
                localStorage.setItem('user', JSON.stringify(data.recordset[0]));
            },
            error => this.gs.toast.present(error.message, 5000));
  }

}
