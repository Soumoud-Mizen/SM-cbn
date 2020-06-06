import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Service } from '../../../../services/service';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss']
})
export class ShowPage  {
  faq = <any>{};
  id: any;
  loading: any;

  constructor(
    public route: ActivatedRoute,
    public Service: Service,
    public alertController: AlertController,
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.Service.getFaqByIdForAdmin(params['id']).subscribe(
        faq => {
          this.faq = faq;
        },
        err => {
          if (err.error['msg']) {
            this.presentAlert(err.error['msg']);
          } else {
            this.presentAlert(err.message);
          }

          console.log('err : product', err);
        }
      );
    });
  }

  deleteFaq() {
    this.deleteIT(this.id);
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
  async deleteIT(id) {
    const alert = await this.alertController.create({
      header: 'Supprimer ce FAQ ',
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
            this.Service.deleteFaqByIDForAdmin(id).subscribe(
              res => {
                this.navCtrl.navigateForward(['/admin-app-use/faq']);
              },
              err => {
                console.log('err : product', err);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
