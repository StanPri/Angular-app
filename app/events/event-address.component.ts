import { Component, Input} from '@angular/core';


@Component({
    selector: 'event-address',
    template: `
    <div>
        <span>Location: {{location.address}}</span>
        <span>&nbsp;</span>
        <span>{{location.city}}, {{location.country}}</span>
    </div>
    `
})


export class EventAddressComponent {
 @Input() location:any
}

