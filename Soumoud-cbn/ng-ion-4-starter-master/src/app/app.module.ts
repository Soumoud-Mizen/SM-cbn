import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { dummyBackendProvider } from '../app/interceptors/dummy.backend.interceptor';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe/ngx';

import { CreatePaymentMethodsPageModule } from './pages/consumer-app-use/payment-methods/create-payment-methods/create-payment-methods.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    CreatePaymentMethodsPageModule,
    BrowserAnimationsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // Remove this line if you want to use the real BFF API
    //dummyBackendProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    WebView,
    FilePath,
    Stripe,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    InAppBrowser,
    SocialSharing,
    AppRate
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
