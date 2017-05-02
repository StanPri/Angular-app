
import { EventsAppComponent } from './events-app.component';
import {NgModule} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from "./header/header.component";
import { SectionComponent } from "./section/section.component";
import { FooterComponent } from "./footer/footer.component";
import { CenterComponent } from "./center/center.component";
@NgModule({
    imports: [BrowserModule],
    declarations: [
        EventsAppComponent,
        HeaderComponent,
        SectionComponent,
        FooterComponent,
        CenterComponent
    ],
    bootstrap: [EventsAppComponent]
})

export class AppModule {}