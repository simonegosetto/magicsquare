import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'tutorial',
    loadChildren: './tutorial/tutorial.module#TutorialPageModule'
  },
  { path: 'singleplayer', loadChildren: './singleplayer/singleplayer.module#SingleplayerPageModule' },
  { path: 'multiplayer/:gameid', loadChildren: './multiplayer/multiplayer.module#MultiplayerPageModule' },  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
