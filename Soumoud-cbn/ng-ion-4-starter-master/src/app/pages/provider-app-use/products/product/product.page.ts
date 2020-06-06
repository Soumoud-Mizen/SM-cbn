import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Service } from '../../../../services/service';
import {
  AlertController,
  NavController,
  LoadingController
} from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss']
})
export class ProductPage implements OnInit {
  product = <any>{};
  id: any;
  loading: any;
  constructor(
    public route: ActivatedRoute,
    public Service: Service,
    public alertController: AlertController,
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.Service.getProductByID(params['id']).subscribe(
        product => {
          this.product = product;
        },
        err => {
          console.log('err : product', err);
        }
      );
    });
  }

  deleteProduct() {
    this.route.params.subscribe((params: Params) => {
      this.deleteIT(params['id']);
    });
  }

  async deleteIT(id) {
    const alert = await this.alertController.create({
      header: 'Supprimer ce produit ',
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
            this.Service.deleteProductByID(id).subscribe(
              res => {
                this.navCtrl.navigateForward(['/provider-app-use/products']);
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

  changeStatus(status) {
    this.changeIt(status);
  }

  async changeIt(status) {
    const alert = await this.alertController.create({
      header: 'Mettre ce produit en ' + status,
      message: 'Etes vous sur de vouloir changer ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'medium',
          handler: para => {}
        },
        {
          text: 'Oui',
          cssClass: 'danger',
          handler: () => {
            this.presentLoading();
            this.Service.changeProductStatus(status, this.id).subscribe(
              res => {
                if (this.product.status) {
                  this.product.status = status;
                }
                this.loading.dismiss();
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Chargement...'
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();

  }
}
