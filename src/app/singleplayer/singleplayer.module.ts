import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SingleplayerPage } from './singleplayer.page';
import {GameModule} from '../core/components/game/game.module';

const routes: Routes = [
  {
    path: '',
    component: SingleplayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    GameModule
  ],
  declarations: [SingleplayerPage]
})
export class SingleplayerPageModule {}
