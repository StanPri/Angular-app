import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'event-thumbnail',
    template: `
    <div class='well hoverwell thumbnail'>
        <h2>{{event.name}}</h2>
        <div>Date: {{event.date}}</div>
        <div>Time: {{event.time}}</div>
        <div>Price: \${{event.price}}</div>
        <event-address [location] = 'event.location'></event-address>
        <button class="btn btn-primary" (click)="handleClick()"> Click! </button>
    </div>
    `
})

export class EventThumbnailComponent {
    @Input() event:any
    @Output() itemClick = new EventEmitter();

    handleClick(){
        this.itemClick.emit(this.event.name)
    }
}