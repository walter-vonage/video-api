import { Component } from '@angular/core';
import { SmsService } from '../../service/sms.service';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrl: './sms.component.scss'
})
export class SmsComponent {

    to: string | undefined = '447375637447';
    message: string | undefined = 'Hello from Angular!';

    constructor(
        private sms: SmsService
    ) { }

    sendSms() {
        if (this.to && this.message) {
            this.sms.sendMessage(this.to, this.message, (response: any) => {
                console.log(response)
            })
        }
    }

}
