import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Network } from '@ionic-native/network/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import {ModalQueueComponent} from './multiplayer/modal-queue.component';

@NgModule({
  declarations: [AppComponent, ModalQueueComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [ModalQueueComponent],
  entryComponents: [ModalQueueComponent],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
