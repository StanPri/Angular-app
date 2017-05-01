import { ToastrService } from './../common/toastr.service';
import { EventService } from './shared/event.service';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'events-list',
    template: `
      <div>
        <h1>Angular 2 Components</h1>
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
    
    constructor(private eventService: EventService, private toastr: ToastrService){
    }

    ngOnInit() {
      this.events = this.eventService.getEvents();
    }

    handleEventClicked(eventName) {
       this.toastr.success(eventName)
    }
}