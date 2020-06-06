import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Service } from './services/service';
import { environment } from '../environments/environment';

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public providerMenuPages = [
    {
      title: 'Produits',
      url: '/provider-app-use/products',
      icon: 'pricetags'
    },
    {
      title: 'Chats',
      url: '/provider-app-use/chats',
      icon: 'chatbubbles'
    },
    {
      title: 'Paramètres',
      url: '/provider-app-use/settings',
      icon: 'cog'
    }
  ];

    public adminMenuPages = [
    {
      title: 'Fournisseurs',
      url: '/admin-app-use/providers',
      icon: 'people'
    },
     {
      title: 'Fournisseurs en attende',
      url: '/admin-app-use/providers-confirm',
      icon: 'people'
    },
    {
      title: 'Clients',
      url: '/admin-app-use/consumers',
      icon: 'contacts'
    },
    {
      title: 'FAQ',
      url: '/admin-app-use/faq',
      icon: 'help'
    },
    {
      title: 'Paramètres',
      url: '/admin-app-use/settings',
      icon: 'cog'
    }
  ];

    public consumerMenuPages = [
      
    {
      title: 'Commander',
      url: '/consumer-app-use',
      icon: 'cube'
    },
    {
      title: 'Mon profil',
      url: '/consumer-app-use/profile',
      icon: 'person'
    },
    {
      title: 'Historique des commandes',
      url: '/consumer-app-use/orders-history',
      icon: 'filing'
    },{
      title: 'Chats',
      url: '/consumer-app-use/chats',
      icon: 'chatbubbles'
    },
    {
      title: 'Moyens de paiement',
      url: '/consumer-app-use/payment-methods',
      icon: 'card'
    },
    {
      title: 'Promotions',
      url: '/consumer-app-use/promotions',
      icon: 'bookmarks'
    },
    {
      title: 'Aide',
      url: '/consumer-app-use/faq/show-menu',
      icon: 'help'
    },
    {
      title: 'À propos',
      url: '/consumer-app-use/about',
      icon: 'information'
    }
    
  ];

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public Service: Service
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     firebase.initializeApp(environment.firebase)
    });
  }


logout() {
   this.Service.logout();
}

  
}
