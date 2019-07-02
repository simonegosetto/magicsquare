import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { CommonModule } from '@angular/common';
import { SquareComponent } from './square/square.component';
import { IonicModule } from '@ionic/angular';
import {CounterComponent} from './counter/counter.component';
import {HttpClientModule} from '@angular/common/http';
import {HeaderMultiplayerComponent} from './header-multiplayer/header-multiplayer.component';

@NgModule({
    declarations: [GameComponent, SquareComponent, CounterComponent, HeaderMultiplayerComponent],
    entryComponents: [],
    imports: [
        CommonModule,
        IonicModule,
        HttpClientModule
    ],
    exports: [GameComponent]
})
export class GameModule {}