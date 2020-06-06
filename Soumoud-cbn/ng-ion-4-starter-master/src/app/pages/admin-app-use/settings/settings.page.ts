import { Component, OnInit } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  userData: any = {};
  loading: any;

  constructor(
    public Service: Service,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.presentLoading();
    this.Service.getUserProfile().subscribe(
      userProfile => {
        this.userData = userProfile;
        this.loading.dismiss();
      },
      err => {
        this.loading.dismiss();
        console.log('err : userProfile', err);
      }
    );
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Chargement...'
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
  }

  async presentAlertPrompt(__key, title) {
    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'text',
          type: 'text',
          placeholder: this.userData[__key]
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: data => {
            if (__key === 'adminLinkPDFToBeProvider') {
              this.Service.changeAdminLinkPDFToBeProvider(data.text).subscribe(
                res => {
                  this.userData.adminLinkPDFToBeProvider = data.text;
                },
                err => {
                  console.log('err : userProfile', err);
                }
              );
            } else if (__key === 'adminLinkToRecommandation')  {
              this.Service.changeAdminLinkToRecommandation(data.text).subscribe(
                res => {
                  this.userData.adminLinkToRecommandation = data.text;
                },
                err => {
                  //alert('error');
                  console.log('err : userProfile', err);
                }
              );
            }else  {
              this.Service.changeAdminLinkMentionsLegales(data.text).subscribe(
                res => {
                  this.userData.adminLinkMentionsLegales = data.text;
                },
                err => {
                  //alert('error');
                  console.log('err : userProfile', err);
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
