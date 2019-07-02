import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalService} from '../core/services/global.service';
import {PlatformLocation} from '@angular/common';
import {ModalService} from '../core/services/modal.service';
import {NavController} from '@ionic/angular';
import {ModalQueueComponent} from '../multiplayer/modal-queue.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    @HostListener('document:ionBackButton', ['$event'])
    // @HostListener('window:popstate', ['$event'])
    private overrideHardwareBackAction($event: any) {
        $event.detail.register(100, async () => {
            this._modal.dismissIfActive();
            // this._popover.dismissIfActive();
            this._navCtrl.back();
        });
    }

  constructor(private router: Router,
              public gs: GlobalService,
              private _modal: ModalService,
              private _navCtrl: NavController,
              private _location: PlatformLocation) {
      this._location.onPopState(() => {
          this._modal.dismissIfActive();
          // this._popover.dismissIfActive();
      });
  }

  navTo(route) {
    switch (route) {
        case 'singleplayer':
        case 'tutorial':
            this.router.navigateByUrl(route);
            break;
        case 'multiplayer':
          if (this.gs.isLogged()) {
              const modalQueue = this._modal.present(ModalQueueComponent, null);
              modalQueue.then(result => {
                  if (result.data) {
                      this.router.navigate(['/multiplayer/' + result.data.id_match]);
                  }
              });
          }
          break;
    }

  }

}
