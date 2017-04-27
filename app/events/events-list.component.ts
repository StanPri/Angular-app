import { Component } from '@angular/core';
@Component({
    selector: 'events-list',
    template: `
        <div>
            <h1>Upcoming Angular 2 Events</h1>
            <hr/>
            <event-thumbnail (itemClick) = "handleItemClicked($event)"
            [event] = "event1"></event-thumbnail>
        </div>`
})

export class EventsListComponent {
    event1 = {
        id: 1,
        name: 'Angular Connect',
        date: '9/26/2056',
        time: '10:10am',
        price: 599.99,
        imangeUrl: '/app/assests/images/angularconnect-shield.png',
        location: {
            address: '1057 DT',
            city: 'London',
            country: 'England'

        }
    }

    handleItemClicked(data) {
        console.log('received: ', data);
    }
}