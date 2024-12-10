import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsWebrtcComponent } from './components/webrtc/webrtc.component';
import { SmsComponent } from './components/sms/sms.component';

const routes: Routes = [
    { path: 'sms', component: SmsComponent },
    { path: '', component: ComponentsWebrtcComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
