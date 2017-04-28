import { NavBarComponent } from './nav/navbar.component';
import { EventAddressComponent } from './events/event-address.component';
import { EventThumbnailComponent } from './events/event-thumbnail.component';
import { EventsListComponent } from './events/events-list.component';
import { EventsAppComponent } from './events-app.component';
import {NgModule} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import {EventService} from './events/shared/event.service';
@NgModule({
    imports: [BrowserModule],
    declarations: [
        EventsAppComponent,
        EventsListComponent,
        EventThumbnailComponent,
        EventAddressComponent,
        NavBarComponent
    ],
    providers: [EventService],
    bootstrap: [EventsAppComponent]
})

export class AppModule {}