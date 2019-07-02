import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../core/services/global.service';
import {ModalService} from '../core/services/modal.service';

@Component({
  selector: 'app-modal-queue',
  templateUrl: './modal-queue.component.html',
  styleUrls: ['./modal-queue.component.scss'],
})
export class ModalQueueComponent implements OnInit {

  constructor(public gs: GlobalService,
              public modal: ModalService) { }

    ngOnInit() {
      this.checkQueue();
    }

    checkQueue() {
        this.gs.callGateway('', '\'' + localStorage.getItem('token') + '\'', false, 0)
            .subscribe(data => {
                    if (data.hasOwnProperty('error')) {
                        this.cancel();
                        this.gs.toast.present(data.error);
                        return;
                    }

                    if (data.recordset.length > 0) {
                        const [ opponent ] = data.recordset;
                        this.close(opponent);
                    } else {
                        setTimeout(() => this.checkQueue(), 1000);
                    }
                },
                error => {
                    this.cancel();
                    this.gs.toast.present(error.message, 5000);
                });
    }

    close(opponent) {
        this.modal.dismiss(opponent);
    }

    cancel() {
        this.modal.dismiss(undefined);
    }

}
