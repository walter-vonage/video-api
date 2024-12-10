import { Injectable } from '@angular/core';
import { Config } from '../utils/config';

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    SERVER = Config.SERVER.dev ? Config.SERVER.local : Config.SERVER.remote

    constructor() { }

    sendMessage(to: string, message: string, callback: any) {
        fetch( this.SERVER + "/sms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to, message
            }),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            callback(response)
        }).catch((error) => {
            console.error("Error:", error);
            console.log("An error occurred while sending this SMS.");
        });
    }

}
