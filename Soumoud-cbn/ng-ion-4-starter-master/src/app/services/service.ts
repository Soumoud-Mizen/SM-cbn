import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../models/user';
import { Token } from '../models/token';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class Service {
  public currentUserTokenSubject: BehaviorSubject<Token>;
  public currentUserToken: Observable<Token>;

  constructor(public http: HttpClient, public router: Router) {
    this.currentUserTokenSubject = new BehaviorSubject<Token>({
      value: localStorage.getItem('currentUserToken')
    });
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }

  public get currentUserTokenValue(): Token {
    return this.currentUserTokenSubject.value;
  }

  public login(email: string, mot_de_passe: string) {
    return this.http
      .post<any>(`${environment.bffUrl}/api/login`, { email, mot_de_passe })
      .pipe(
        map(res => {
          localStorage.setItem('currentUserToken', res.token);
          this.currentUserTokenSubject.next(res.token);
          return res.token;
        })
      );
  }

  public getUserProfileByID(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-user-by-id-for-admin`,
        { id },
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public changeDeliveryTimeForProvider(time) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/change-delivery-time-for-provider`,
        { time },
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProductsForConsumerByIDProvider(id) {
    let __token = localStorage.getItem('currentUserToken');   
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-products-for-user-by-id-provider/${id}`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public changeProductStatus(status, id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/change-product-status/${id}`,
        { status },
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  public updateGPS(lat, lng) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/update-gps`,
        { p: { lat, lng } },
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProductsForCurrentProvider() {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-products-for-current-provider`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getFaqByIdForAdmin(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-faq-by-id-for-admin/${id}`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProductByID(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/product-for-current-provider/${id}`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public deleteUserByID(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .delete<any>(`${environment.bffUrl}/api/delete-user/${id}`, {
        headers: new HttpHeaders({
          'x-auth-token': __token
        })
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public deleteProductByID(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .delete<any>(`${environment.bffUrl}/api/delete-product/${id}`, {
        headers: new HttpHeaders({
          'x-auth-token': __token
        })
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public deleteFaqByIDForAdmin(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .delete<any>(
        `${environment.bffUrl}/api/delete-faq-by-id-for-admin/${id}`,
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public confirmeProviderByID(id) {
    let __token = localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/confirm-provider-by-id-for-admin`,
        { id },
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getUserProfile(token?) {
    let __token = token ? token : localStorage.getItem('currentUserToken');

    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-user`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': __token
          })
        }
      )
      .pipe(
        map(res => {
          
          return res;
        })
      );
  }

  public logout() {
    localStorage.removeItem('currentUserToken');
    this.currentUserTokenSubject.next(null);
    this.router.navigate(['/']);
  }

  public addFAQ(faq: any) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/add-faq`,
        { ...faq },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  public makePaymentForProduct(infos: any) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/create-payment`,
        { ...infos },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  public getCurrentOrdersHistory() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-current-orders-history`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  public getContactProvidersForConsumer() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-contact-providers-for-consumer`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => { 
          console.log(res);
          return res;
        })
      );
  }

  public getContactCmdForProvider() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-contact-cmd-for-provider`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  public addCardToUser(card: any) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/add-card`,
        { ...card },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          
          return res;
        })
      );
  }

  public getCardsUser() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-cards`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getFullNameByID(id) {
    return this.http
      .post<any>(`${environment.bffUrl}/api/get-full-name-by-id/${id}`, {
        headers: new HttpHeaders({
          'x-auth-token': localStorage.getItem('currentUserToken')
        })
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public deleteCardsUser(id) {
    return this.http
      .delete<any>(`${environment.bffUrl}/api/delete-card/${id}`, {
        headers: new HttpHeaders({
          'x-auth-token': localStorage.getItem('currentUserToken')
        })
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getFAQS() {
    return this.http.post<any>(`${environment.bffUrl}/api/get-faqs`, {}).pipe(
      map(res => {
        return res;
      })
    );
  }

  public getConsumersForAdmin() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-consumers-for-admin`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProvidersForAdmin() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-providers-for-admin`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getPromotionsForConsumer() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-promotions-for-consumer`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProviderForConsumer(id) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-provider-for-consumer/${id}`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public changeAdminLinkMentionsLegales(txt) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/change-admin-link-mentions-legales`,
        { txt },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public changeAdminLinkPDFToBeProvider(txt) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/change-admin-link-pdf-to-be-provider`,
        { txt },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public changeAdminLinkToRecommandation(txt) {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/change-admin-link-to-recommandation`,
        { txt },
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getPublicSettings() {
    return this.http
      .post<any>(`${environment.bffUrl}/api/get-public-settings`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getProvidersForConsumer() {    
    return this.http
      .post<any>(`${environment.bffUrl}/api/get-providers-for-consumer`, {}, 
      {
        headers: new HttpHeaders({
          'x-auth-token': localStorage.getItem('currentUserToken')
        })
      })
      .pipe(
        map(res => {
          
          
          return res;
        })
      );
  }

  public getNotConfirmedProviders() {
    return this.http
      .post<any>(
        `${environment.bffUrl}/api/get-providers-not-confirmed-for-admin`,
        {},
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
