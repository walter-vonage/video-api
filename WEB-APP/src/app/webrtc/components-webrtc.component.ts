import { Component, OnInit } from '@angular/core';
import { InternetService } from '../../service/internet.service';
import { WebrtcService } from '../../service/webrtc.service';
import { Config } from '../../utils/config';

@Component({
    selector: 'app-components-webrtc',
    templateUrl: './components-webrtc.component.html',
    styleUrl: './components-webrtc.component.scss'
})
export class ComponentsWebrtcComponent implements OnInit {

    channelName: any;
    userName: any;

    sessionId: any;
    token: any;

    offset = 0;
    count = 10;

    constructor(
        private internet: InternetService,
        private webRtc: WebrtcService
    ) {}

    ngOnInit(): void {}

    createSession() {
        if (!this.channelName) {
            return;
        }
        this.internet.createSession((response: any) => {
            if (response && response.success) {
                this.setGlobalData(response);
                this.getRecordings();
            }
        })
    }

    setGlobalData(response: any) {
        if (response && response.success) {
            Config.PROVIDER = response.provider;
            Config.APPLICATION_ID = response.applicationId;
            Config.OPENTOK_API_KEY = response.openTokApiKey;
            this.sessionId = response.sessionId;                
            console.log('Provider: ' + Config.PROVIDER)
            console.log('Application Id: ' + Config.APPLICATION_ID)
            console.log('OpenTken Api KEY: ' + Config.OPENTOK_API_KEY)
        }
    }

    getRecordings() {
        if (this.sessionId) {
            this.internet.getRecordings(this.sessionId, this.offset, this.count, (response: any) => {
                console.log('Get Recordings: ', response)
            })
        }
    }

    join() {
        if (!this.userName) {
            return;
        }
        this.internet.join(this.sessionId, this.userName, (token: any) => {
            this.token = token;
            this.doTheVideoPart();
        })
    }

    doTheVideoPart() {
        this.webRtc.initializeAndPublish(Config.PROVIDER, this.sessionId, this.token, (response: { vonage: any, publihser: any }) => {
            const vonage = response.vonage;
            const publisher = response.publihser;
            console.log('vonage', vonage)
            console.log('publisher', publisher)
        })
    }


}
