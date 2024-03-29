import {AfterViewInit, Component} from '@angular/core';
import {GlobalService} from '../core/services/global.service';
import {ModalService} from '../core/services/modal.service';
import {GameConfig} from '../core/config/game-config.enum';

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

    //
    // Public
    //
    public localStorage = localStorage;

    ngAfterViewInit() {
        setTimeout(() => {
            localStorage.removeItem('queueID');
            this.timeOutQueue = setTimeout(() => this.checkQueue(), 1000);
        }, 0);
    }

    checkQueue() {
        clearTimeout(this.timeOutQueue);
        this.gs.callGateway('vKh5jvTkLIcpv1rL57TE6bieeXPo5chIlpNb/HGqwGMtWy0tSVYtWy3tyDI2ZL0wTTvmrelP4Cwp+kIPz18uOqfZFTDhIkUV+w@@',
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
                            this.close(opponent);
                        } else {
                            localStorage.setItem('queueID', opponent.id);
                            this.timeOutQueue = setTimeout(() => this.checkQueue(), GameConfig.QUEUE_REFRESH_RATE);
                        }
                    } else {
                        this.timeOutQueue = setTimeout(() => this.checkQueue(), GameConfig.QUEUE_REFRESH_RATE);
                    }
                },
                error => {
                    this.cancel();
                    this.gs.toast.present(error.message, 5000);
                });
    }

    close(opponent) {
        localStorage.removeItem('queueID');
        clearTimeout(this.timeOutQueue);
        this.modal.dismiss(opponent);
    }

    cancel() {
        this.gs.callGateway('DL/yHOfSfn+OhQn/gLvQHoLV8grC7bRHpDSnwlJy3z4tWy0tSVYtWy2E3qNZ9BnM7P7NSq3kVX/bOo41JZRJjpQIp0Ra0vHtCg@@',
            '\'' + localStorage.getItem('token') + '\'' , false, 0)
            .subscribe(data => {
                if (data.hasOwnProperty('error')) {
                    this.gs.toast.present(data.error);
                    return;
                }

                localStorage.removeItem('queueID');
                clearTimeout(this.timeOutQueue);
                this.modal.dismiss(undefined);

            },
            error => this.gs.toast.present(error.message, 5000));
    }

}
