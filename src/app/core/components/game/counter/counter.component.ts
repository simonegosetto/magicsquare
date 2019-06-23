import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
      <ion-row>
          <ion-col class="ion-text-center">
              <h1>{{ count }}</h1>
          </ion-col>
      </ion-row>
  `,
  styles: [`
    ion-row { width: 100% }
  `]
})
export class CounterComponent {

  constructor() { }

  @Input() count: number;

}
