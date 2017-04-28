import { EventService } from './shared/event.service';
import { Component, OnInit } from '@angular/core';
// import {toastr} from 'toastr';

@Component({
    selector: 'events-list',
    template: `
      <div>
        <h1>Angular 2 Events</h1>
        <hr/>
        <div class="row">
          <div *ngFor="let event of events" class="col-md-5">
            <event-thumbnail (click)="handleEventClicked(event.name)" [event]="event"></event-thumbnail>
          </div>
        </div>
      </div>`
})

export class EventsListComponent implements OnInit{
    events:any[]
    
    constructor(private eventService: EventService){
    }

    ngOnInit() {
      this.events = this.eventService.getEvents();
    }

    handleEventClicked(eventName) {
       // toastr.success(eventName)
    }
}