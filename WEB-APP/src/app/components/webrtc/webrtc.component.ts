import { Component, OnInit } from '@angular/core';
import { InternetService } from '../../service/internet.service';
import { WebrtcService } from '../../service/webrtc.service';
import { Config } from '../../utils/config';
import { RecordingModel } from '../row-recording/row-recording.component';

@Component({
    selector: 'app-components-webrtc',
    templateUrl: './webrtc.component.html',
    styleUrl: './webrtc.component.scss'
})
export class ComponentsWebrtcComponent implements OnInit {

    //  Video channel name
    channelName: any;
    //  Logged user name
    userName: any;

    //  All this is returned from server
    sessionId: any;
    token: any;
    provider: any;
    applicationId: any;
    openTokApiKey: any;

    //  Counting for recordings pagination
    offset = 0;
    count = 10;

    //  Recordings
    activeRecordingId: string | undefined;  //  Store in DB if the user refreshes the page
    recordings: Array<RecordingModel> = [];

    constructor(
        private internet: InternetService,
        private webRtc: WebrtcService
    ) {}

    ngOnInit(): void {
        this.getRecordings();
    }

    createSession() {
        if (!this.channelName) {
            return;
        }
        this.internet.createSession((response: any) => {
            if (response && response.success) {
                this.setGlobalData(response);
            }
        })
    }

    setGlobalData(response: any) {
        if (response && response.success) {
            Config.PROVIDER = response.provider;
            Config.APPLICATION_ID = response.applicationId;
            Config.OPENTOK_API_KEY = response.openTokApiKey;
            this.sessionId = response.sessionId;                
            this.provider = response.provider;
            this.applicationId = response.applicationId;
            this.openTokApiKey = response.openTokApiKey;
            console.log('Provider: ' + Config.PROVIDER)
            console.log('Application Id: ' + Config.APPLICATION_ID)
            console.log('OpenTken Api KEY: ' + Config.OPENTOK_API_KEY)
        }
    }

    join(role: 'publisher' | 'subscriber') {
        if (!this.userName) {
            return;
        }
        this.internet.join(this.sessionId, role, this.userName, (token: any) => {
            this.token = token;
            this.doTheVideoPart(() => {
                this.startRecording();
            });
        })
    }

    doTheVideoPart(callback: any) {
        this.webRtc.initializeAndPublish(this.provider, this.applicationId, this.openTokApiKey, this.sessionId, this.token, (response: { vonage: any, publisher: any }) => {
            const vonage = response.vonage;
            const publisher = response.publisher;
            console.log('vonage', vonage)
            console.log('publisher', publisher)
            callback();
        })
    }

    startRecording() {
        this.internet.startRecording(this.sessionId, 'My Recording at ' + new Date(), (response: any) => {
            console.log('Recording: ', response)
        })
    }

    getRecordings() {
        this.internet.getRecordings(1, 10, (response: any) => {
            console.log('Get user sessions: ', response)
            if (response && response.success) {
                for (let item of response.recordings) {
                    this.recordings.push(item)
                }
            }
        })        
    }

}
