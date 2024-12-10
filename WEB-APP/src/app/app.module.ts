import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsWebrtcComponent } from './components/webrtc/webrtc.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmsComponent } from './components/sms/sms.component';
import { RowRecordingComponent } from './components/row-recording/row-recording.component';

@NgModule({
    declarations: [
        AppComponent,
        ComponentsWebrtcComponent,
        SmsComponent,
        RowRecordingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
