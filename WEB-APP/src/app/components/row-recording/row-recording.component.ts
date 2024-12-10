import { Component, Input } from '@angular/core';
import { InternetService } from '../../service/internet.service';

export interface RecordingModel {
    applicationId: string,
    createdAt: number,
    duration: number,
    event: string,
    hasAudio: boolean,
    hasTranscription: boolean,
    hasVideo: boolean,
    id: string,
    multiArchiveTag: string
    name: string,
    outputMode: string,
    password: string,
    reason: string
    resolution: string,
    sessionId: string,
    sha256sum: string,
    size: number,
    status: string,
    streamMode: string,
    updatedAt: number,
    url: string,
}

@Component({
  selector: 'app-row-recording',
  templateUrl: './row-recording.component.html',
  styleUrl: './row-recording.component.scss'
})
export class RowRecordingComponent {

    @Input() item: RecordingModel | undefined;

    constructor(
        private internet: InternetService
    ) {}

    
}
