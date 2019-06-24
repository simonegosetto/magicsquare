import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MultiplayerPage } from './multiplayer.page';
import { GameModule } from '../core/components/game/game.module';

const routes: Routes = [
  {
    path: '',
    component: MultiplayerPage
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
  declarations: [MultiplayerPage]
})
export class MultiplayerPageModule {}
