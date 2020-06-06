import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Service } from '../services/service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(public Service: Service) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUserToken = this.Service.currentUserTokenValue;
        console.log('currentUserToken', currentUserToken);
        
        if (currentUserToken && currentUserToken.value) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Basic ${currentUserToken.value}`
                }
            });
        }

        return next.handle(request);
    }
}