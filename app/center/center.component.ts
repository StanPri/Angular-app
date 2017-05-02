import {Component} from '@angular/core'

@Component ({
    selector: 'Center-App',
    templateUrl: 'app/center/center.component.html',
    
})
export class CenterComponent  {
    fullImagePath: string;
    constructor() {
        this.fullImagePath = 'app/Content/images/logo.png'
    }
}