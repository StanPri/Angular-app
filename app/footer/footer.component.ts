import {Component} from '@angular/core'

@Component ({
    selector: 'Footer-App',
    template: `
        <div class="row ajax-loader hidden">
            <div class="col-xs-12 text-center">
                <i class="fa fa-refresh fa-spin fa-2x fa-fw "></i>
            </div>
        </div>
    `
    
})
export class FooterComponent  {
    
}