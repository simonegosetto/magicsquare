import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {GlobalService} from './core/services/global.service';
import {Network} from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Tutorial',
      url: '/tutorial',
      icon: 'school'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    public gs: GlobalService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@ CHECK CONNESSIONE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      this.gs.checkConnection();
      // watch network for a disconnection
      const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
          console.log('disconnessione');
          this.gs.checkConnection();
      });
      // stop disconnect watch
      // disconnectSubscription.unsubscribe();
      // watch network for a connection
      const connectSubscription = this.network.onConnect().subscribe(() => {
          console.log('connessione');
          this.gs.checkConnection();
      });
      // stop connect watch
      // connectSubscription.unsubscribe();
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        // controllo token
        if (localStorage.getItem('token') === undefined || localStorage.getItem('token') === null ) {
            if (this.gs.isOnline()) {
              this.gs.logged = false;
              this.gs.sendUUID();
            }
        } else {
            this.gs.user = JSON.parse(localStorage.getItem('user'));
            this.gs.init();
        }
    });
  }
}
