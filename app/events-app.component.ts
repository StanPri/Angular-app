import {Component} from '@angular/core'

@Component ({
    selector: 'event-app',
    templateUrl: 'app/event-app.component.html'
})
export class EventsAppComponent  {
    fullImagePath: string;
    constructor() {
        this.fullImagePath = 'app/Content/images/logo.png'
    }
}