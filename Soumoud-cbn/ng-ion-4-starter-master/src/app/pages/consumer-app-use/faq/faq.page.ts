import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss']
})
export class FaqPage {
  faqs = [];
  loadingComponent: any;
typeButton;
  constructor(
    public service: Service,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    this.route.params.subscribe(
      (params: Params) => {
        this.typeButton = params["type"];
      },
      err => {
        console.log('err : Params', err);
      }
    );

    this.presentLoading();

    this.service.getFAQS().subscribe(
      faqs => {
        this.faqs = faqs;
        this.dismissLoading();
      },
      err => {
        if (err.error['msg']) {
          this.presentAlert(err.error['msg']);
        } else {
          this.presentAlert(err.message);
        }
        this.dismissLoading();
        console.log('err : getFAQS', err);
      },
      () => {}
    );
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Attention',
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
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
