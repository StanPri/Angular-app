import {Component} from '@angular/core'

@Component ({
    selector: 'Header-App',
    templateUrl: 'app/header/header.component.html',
    
})
export class HeaderComponent  {
    fullImagePath: string;
    constructor() {
        this.fullImagePath = 'app/Content/images/logo.png'
    }
}