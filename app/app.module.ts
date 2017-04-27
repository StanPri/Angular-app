import { EventAddressComponent } from './events/event-address.component';
import { EventThumbnailComponent } from './events/event-thumbnail.component';
import { EventsListComponent } from './events/events-list.component';
import { EventsAppComponent } from './events-app.component';
import {NgModule} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';




@NgModule({
    imports: [BrowserModule],
    declarations: [
        EventsAppComponent,
        EventsListComponent,
        EventThumbnailComponent,
        EventAddressComponent
    ],
    bootstrap: [EventsAppComponent]
})

export class AppModule {}