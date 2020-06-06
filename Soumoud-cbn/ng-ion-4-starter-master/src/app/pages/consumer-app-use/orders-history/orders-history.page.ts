import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.page.html',
  styleUrls: ['./orders-history.page.scss']
})
export class OrdersHistoryPage {
  payments = [];
  loadingComponent: any;

  constructor(
    public service: Service,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) {
    this.presentLoading();
  }

  openOrderPage(order) {
    this.navCtrl.navigateForward([
      '/consumer-app-use/orders-history/order/' + JSON.stringify(order)
    ]);
  }

  secondsToISOString(seconds) {
    const date = new Date(seconds * 1000);
    return date.toISOString();
  }

  ionViewWillEnter() {
    this.service.getCurrentOrdersHistory().subscribe(
      payments => {
        this.payments = payments;
        this.dismissLoading();
      },
      err => {
        this.dismissLoading();
        console.log('err : getCurrentOrdersHistory', err);
      },
      () => {}
    );
  }

  async presentLoading() {
    this.loadingComponent = await this.loadingController.create({
      message: 'Chargement...'
    });
    await this.loadingComponent.present();

    const { role, data } = await this.loadingComponent.onDidDismiss();
  }

  async dismissLoading() {
    await this.loadingComponent.dismiss();
  }
}
