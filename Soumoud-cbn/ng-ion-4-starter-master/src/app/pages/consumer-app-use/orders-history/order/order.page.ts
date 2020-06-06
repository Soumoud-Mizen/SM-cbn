import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss']
})
export class OrderPage {
  loadingComponent;
order;
  constructor(
    public route: ActivatedRoute,
    public loadingController: LoadingController
  ) {}

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoadingIt(loading);

    this.route.params.subscribe(
      (params: Params) => {
        this.order = JSON.parse(decodeURIComponent(params['order_obj']));
        console.log('====================================');
        console.log(this.order);
        console.log('====================================');
        loading.dismiss();
      },
      err => {
        console.log('err : Params', err);
        loading.dismiss();
      }
    );
  }
  async presentLoadingIt(loading) {
    return await loading.present();
  }
}
