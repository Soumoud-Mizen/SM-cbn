import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Service } from '../../../../services/service';

import {
  LoadingController,
  AlertController,
  NavController
} from '@ionic/angular';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.page.html',
  styleUrls: ['./consumer.page.scss']
})
export class ConsumerPage {
  userData = <any>{};
  loadingComponent: any;

  constructor(
    public route: ActivatedRoute,
    public service: Service,
    public alertController: AlertController,
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.presentLoading();
    this.route.params.subscribe(
      (params: Params) => {
        this.service.getUserProfileByID(params['id']).subscribe(
          userProfile => {
            this.userData = userProfile;
            this.dismissLoading();
          },
          err => {
            console.log('err : getUserProfileByID', err);
            this.dismissLoading();
          }
        );
      },
      err => {
        console.log('err : Params', err);
        this.dismissLoading();
      }
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

  deleteUser() {
    this.route.params.subscribe((params: Params) => {
      this.deleteIT(params['id']);
    });
  }

  async deleteIT(id) {
    const alert = await this.alertController.create({
      header: 'Supprimer ce client ',
      message: 'Etes vous sur de vouloir supprimer ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'medium',
          handler: para => {}
        },
        {
          text: 'Supprimer',
          cssClass: 'danger',
          handler: () => {
            this.service.deleteUserByID(id).subscribe(
              res => {
                this.navCtrl.navigateForward(['/admin-app-use/consumers']);
              },
              err => {
                console.log('err : client', err);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
