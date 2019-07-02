import {AfterViewInit, Component} from '@angular/core';
import {GlobalService} from '../core/services/global.service';
import {ModalService} from '../core/services/modal.service';

@Component({
  selector: 'app-modal-queue',
  templateUrl: './modal-queue.component.html',
  styleUrls: ['./modal-queue.component.scss'],
})
export class ModalQueueComponent implements AfterViewInit  {

  constructor(public gs: GlobalService,
              public modal: ModalService) { }

    //
    // Private
    //
    private timeOutQueue = null;

    ngAfterViewInit() {
        localStorage.removeItem('queueID');
        this.timeOutQueue = setTimeout(() => this.checkQueue(), 1000);
    }

    checkQueue() {
        clearTimeout(this.timeOutQueue);
        this.gs.callGateway('oU0PuEP0ffbr68Pmi7e9Q/sJCgJctpUiEoW/ew2TQVgtWy0tSVYtWy0cMYxCtJouNKVsbkOsvWw6J5xsjgCQls+JdgERlJZiCQ@@',
            '\'' + localStorage.getItem('token') + '\',' + localStorage.getItem('queueID'), false, 0)
            .subscribe(data => {
                    if (data.hasOwnProperty('error')) {
                        this.cancel();
                        this.gs.toast.present(data.error);
                        return;
                    }
                    if (data.recordset.length > 0 && data.recordset[0] !== null) {
                        const [ opponent ] = data.recordset;
                        if (opponent.hasOwnProperty('id_match')) {
                            localStorage.removeItem('queueID');
                            this.close(opponent);
                        } else {
                            localStorage.setItem('queueID', opponent.id);
                            this.timeOutQueue = setTimeout(() => this.checkQueue(), 1000);
                        }
                    } else {
                        this.timeOutQueue = setTimeout(() => this.checkQueue(), 1000);
                    }
                },
                error => {
                    this.cancel();
                    this.gs.toast.present(error.message, 5000);
                });
    }

    close(opponent) {
        clearTimeout(this.timeOutQueue);
        this.modal.dismiss(opponent);
    }

    cancel() {
        clearTimeout(this.timeOutQueue);
        this.modal.dismiss(undefined);
    }

}
