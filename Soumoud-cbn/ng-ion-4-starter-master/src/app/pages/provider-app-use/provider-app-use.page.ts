import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Service } from '../../services/service';

@Component({
  selector: 'app-provider-app-use',
  templateUrl: './provider-app-use.page.html',
  styleUrls: ['./provider-app-use.page.scss']
})
export class ProviderAppUsePage implements OnInit {

  userData = <any>{};

  constructor(public menu: MenuController, public Service: Service) {}

   ngOnInit() {
    this.Service.getUserProfile().subscribe(
      userProfile => {
        this.userData = userProfile;
      },
      err => {
        console.log('err : userProfile', err);
      }
    );
  }

  ionViewDidEnter() {
    this.menu.enable(false, 'consumerMenu');
    this.menu.enable(false, 'adminMenu');
    this.menu.enable(true, 'providerMenu');
  }
}
