import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {GlobalService} from '../core/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router,
              public gs: GlobalService) {}

  navTo(route) {
    this.router.navigateByUrl(route);
  }

}
