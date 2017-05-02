import {Component} from '@angular/core'

@Component ({
    selector: 'event-app',
    template: `
        <div class="container-fluid portal-container">
            <Header-App></Header-App>
            <Section-App></Section-App>
            <Footer-App></Footer-App>
        </div>`,
    styleUrls: [
        '../Scripts/simplebar.js',
        '../Scripts/modernizr-2.6.2.js',
        '../Scripts/fullcalendar.js',
        '../Scripts/simplebar.js']
})
export class EventsAppComponent  {
    
}