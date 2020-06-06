import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Service } from '../../../../services/service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.page.html',
  styleUrls: ['./provider.page.scss'],
})
export class ProviderPage implements OnInit {

  userData = <any>{};

  constructor(public route: ActivatedRoute,
   public service: Service,
   public alertController: AlertController,
   public navCtrl: NavController) {}

  ngOnInit() {
      this.route.params.subscribe((params: Params) => {
       this.service.getUserProfileByID(params['id']).subscribe(
      userProfile => {
        this.userData = userProfile;
      },
      err => {
        console.log('err : userProfile', err);
      }
    );
    });
  }

  async alertIt() {
    const alert = await this.alertController.create({
      header: 'Confirmer avec succès',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'success',
          handler: () => {
            this.navCtrl.navigateForward(
              ['/admin-app-use/providers-confirm']
            );
          }
        }
      ]
    });

    await alert.present();
  }

  confirme() {
      this.route.params.subscribe((params: Params) => {
       this.service.confirmeProviderByID(params['id']).subscribe(
      () => {
       this.alertIt();
      },
      err => {
        console.log('err : userProfile', err);
      }
    );
    });
  }
 deleteUser() {
    this.route.params.subscribe((params: Params) => {
      this.deleteIT(params['id']);
    });
  }

  async deleteIT(id) {
    const alert = await this.alertController.create({
      header: 'Supprimer ce fournisseur ',
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
                this.navCtrl.navigateForward(['/admin-app-use/providers-confirm']);
              },
              err => {
                console.log('err : providers', err);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
