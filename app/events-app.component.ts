import {Component} from '@angular/core'

@Component ({
    selector: 'event-app',
    templateUrl: 'app/event-app.component.html',
    styleUrls: [
        '../Scripts/simplebar.js',
        '../Scripts/modernizr-2.6.2.js',
        '../Scripts/fullcalendar.js',
        '../Scripts/simplebar.js']
})
export class EventsAppComponent  {
    fullImagePath: string;
    constructor() {
        this.fullImagePath = 'app/Content/images/logo.png'
    }
}