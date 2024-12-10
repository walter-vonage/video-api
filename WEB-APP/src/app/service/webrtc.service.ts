import { Injectable } from '@angular/core';
import { Config } from '../utils/config';
import * as OT from '@opentok/client';

@Injectable({
    providedIn: 'root'
})
export class WebrtcService {

    VIDEO_PROVIDEOR: 'vonage' | 'opentok' | undefined;

    constructor() { }

    initializeAndPublish(provider: 'vonage' | 'opentok' | undefined, applicationId: string, openTokApiKey: any, sessionId: string, token: string, callback: any) {
        //  Get if we use opentok or vonage    
        this.VIDEO_PROVIDEOR = provider;
        //  Validate input
        if (!sessionId || !token || !this.VIDEO_PROVIDEOR) {
            console.log("You need to join first");
            return;
        }
        // Initialize the OpenTok session
        const apiKey: any = this.VIDEO_PROVIDEOR == 'vonage' ? applicationId : openTokApiKey;
        const myVonageSession = OT.initSession(apiKey, sessionId);
        // Handle the session connection
        myVonageSession.connect(token, (error: any) => {
            if (error) {
                console.error("Failed to connect to session:", error);
                return;
            }
            console.log("Connected to session:", sessionId);
            // Create a publisher object
            const myPublisher = OT.initPublisher("publisher", {
                insertMode: "append",
                width: "320px",
                height: "240px",
                noiseSuppression: true,
                scalableVideo: true,
                showControls: true
            });
            // Publish the stream to the Vonage session
            myVonageSession.publish(myPublisher, (error: any) => {
                if (error) {
                    console.error("Failed to publish stream:", error);
                } else {
                    console.log("Stream published successfully");
                    callback({
                        vonage: myVonageSession, 
                        publisher: myPublisher
                    })
                }
            });
        });
        // Optional: Handle stream events
        myVonageSession.on("streamCreated", (event: any) => {
            myVonageSession.subscribe(event.stream, "subscriber", {
                insertMode: "append",
                width: "320px",
                height: "240px",
            });
        })
    }

}
