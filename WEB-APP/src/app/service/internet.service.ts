import { Injectable } from '@angular/core';
import { Config } from '../utils/config';

@Injectable({
    providedIn: 'root'
})
export class InternetService {

    SERVER = Config.SERVER.dev ? Config.SERVER.local : Config.SERVER.remote

    constructor() { }

    createSession(callback: any) {
        fetch( this.SERVER + "/create-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                archive: '0'
            }),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            if (response && response.success) {
                const sessionId = response.sessionId;
                Config.VIDEO.VONAGE_APPLICATION_ID = response.applicationId;
                Config.VIDEO.OPENTOK_API_KEY = response.openTokApiKey;
                Config.PROVIDER = response.provider;
                console.log(`Session Created!\nSession ID: ${sessionId}`);
                callback(response)
            } else {
                console.log(response);
                console.log(`Error: ${response.error}`);
            }
        }).catch((error) => {
            console.error("Error:", error);
            console.log("An error occurred while creating the session.");
        });
    }

    join(sessionId: string, role: 'publisher' | 'subscriber', username: string, callback: any) {
        const expirationTimeInMinutes = 60;
        this.joinSession(sessionId, role, username, expirationTimeInMinutes, (response: any) => {
            console.log(response)
            if (response && response.success) {
                console.log(response.token ? "User Joined!" : "User failed to join");
                callback(response.token)
            }
        });
    }

    joinSession(sessionId: string, role: 'publisher' | 'subscriber', userName: string, expirationTimeInMinutes: number, callback: any) {
        fetch( this.SERVER + "/generate-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                role,
                userName,
                expirationTimeInMinutes,
            }),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            callback(response);
        }).catch((error) => {
            console.error("Error:", error);
        });
    }

    //  recordings

    startRecording(sessionId: string, name: string, callback: any) {
        fetch( this.SERVER + "/recording/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                name,
            }),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            callback(response);
        }).catch((error) => {
            console.error("Error:", error);
        });
    }

    stopRecording(recordingId: string, callback: any) {
        fetch( this.SERVER + "/recording/stop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recordingId,
            }),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            callback(response);
        }).catch((error) => {
            console.error("Error:", error);
        });
    }

    getRecordings(offset: number, count: number, callback: any) {
        fetch( this.SERVER + "/recording/" + offset + '/' + count, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json()).then((response) => {
            callback(response);
        }).catch((error) => {
            console.error("Error:", error);
        });
    }


}
