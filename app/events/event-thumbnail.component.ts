import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'event-thumbnail',
    template: `
        <div class='well hoverwell thumbnail'>
            <h2>{{event?.name}}</h2>
            <div>Date: {{event?.date}}</div>
            <div>Time: {{event?.time}}</div>
            <div>Price: \${{event?.price}}</div>
            <div>
                <span>Location: {{event?.location?.address}}</span>
                <span>&nbsp;</span>
                <span>{{event?.location?.city}}, {{event?.location?.country}}</span>
            </div>
            <div>
                Online URL: {{event?.onlineUrl}}
            </div>
        </div>
    `,
    styles: [`
      .thumbnail { min-height: 220px; }
      .pad-left {margin-left: 10px;}
      .well div { color: #bbb;}
    `]
})

export class EventThumbnailComponent {
    @Input() event:any
    @Output() itemClick = new EventEmitter();

    handleClick(){
        this.itemClick.emit(this.event.name)
    }
}