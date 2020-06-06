import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Service } from '../services/service';

@Injectable({ providedIn: 'root' })
export class RoutingInterceptior implements CanActivate {
    constructor(
        public router: Router,
        public Service: Service
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUserToken = this.Service.currentUserTokenValue;
        if (currentUserToken) {
            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}