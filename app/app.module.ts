import { ToastrService } from './common/toastr.service';
import { NavBarComponent } from './nav/navbar.component';
import { EventAddressComponent } from './events/event-address.component';
import { EventThumbnailComponent } from './events/event-thumbnail.component';
import { EventsListComponent } from './events/events-list.component';
import { EventsAppComponent } from './events-app.component';
import {NgModule} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EventService } from './events/shared/event.service';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { appRoutes } from './routes';
@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        EventsAppComponent,
        EventsListComponent,
        EventThumbnailComponent,
        EventAddressComponent,
        NavBarComponent,
        EventDetailsComponent 
    ],
    providers: [EventService, ToastrService],
    bootstrap: [EventsAppComponent]
})

export class AppModule {}