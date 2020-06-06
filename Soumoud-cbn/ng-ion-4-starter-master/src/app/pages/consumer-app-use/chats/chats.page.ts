import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss']
})
export class ChatsPage {
  provs = [];
  loadingComponent: any;

  constructor(
    public service: Service,
    public loadingController: LoadingController
  ) {
    this.presentLoading();
  }

  ionViewWillEnter() {
    this.service.getContactProvidersForConsumer().subscribe(
      provs => {
        this.provs = provs;
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
