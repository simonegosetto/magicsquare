import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toast: ToastController) { }

  async present(message: string, duration: number = 3000, close = false, color = 'dark') {
      const toast = await this.toast.create({
          message: message,
          duration: duration,
          showCloseButton: close,
          color: color
      });
      return toast.present();
  }
}
