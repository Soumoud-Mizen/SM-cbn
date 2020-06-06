import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Service } from '../../../services/service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  userData: any = {};
  loading: any;
  customPickerOptions: any;

  constructor(
    public menu: MenuController,
    public Service: Service,
    public loadingController: LoadingController,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public androidPermissions: AndroidPermissions,
    public alertController: AlertController
  ) {
    this.customPickerOptions = {
      buttons: [
        {
          text: 'Enregistrer',
          handler: () => {
            this.Service.changeDeliveryTimeForProvider(this.userData.deliveryTime).subscribe(
              res => {
              },
              err => {
                this.loading.dismiss();
                alert("error");
                console.log('err : userProfile', err);
              }
            );
          }
        },
        {
          text: 'Annuler',
          handler: () => {
            return false;
          }
        }
      ]
    };
  }

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

  ionViewDidEnter() {
    this.menu.enable(false, 'consumerMenu');
    this.menu.enable(false, 'adminMenu');
    this.menu.enable(true, 'providerMenu');
  }

  async ChangeIT() {
    const alert = await this.alertController.create({
      header: 'Charger nouveau position GPS ',
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
            this.checkGPSPermission();
          }
        }
      ]
    });

    await alert.present();
  }

  //Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        result => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert(
                'requestPermission Error requesting location permissions ' +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getUserPosition();
        },
        error =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }

  getUserPosition() {
    this.presentLoading();
    this.geolocation.getCurrentPosition().then(
      position => {
        this.Service.updateGPS(position.coords.latitude, position.coords.latitude).subscribe(
          res => {
            this.userData.lat = position.coords.latitude;
            this.userData.lng = position.coords.longitude;

            // this.userData.lat = 48.86763;
            // this.userData.lng = 2.269241;

            this.loading.dismiss();
          },
          err => {
            console.log('err : product', err);
            this.loading.dismiss();
          }
        );
      },
      err => {
        this.loading.dismiss();
        alert('err ' + err);
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
}
