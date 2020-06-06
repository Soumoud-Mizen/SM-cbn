import { Component, OnInit } from '@angular/core';
import { Service } from '../../../services/service';
import { ModalController, LoadingController } from '@ionic/angular';
import { CreatePaymentMethodsPage } from './create-payment-methods/create-payment-methods.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss']
})
export class PaymentMethodsPage implements OnInit {
  cards = [];

  constructor(
    public Service: Service,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {}

  async presentLoadingIt(loading) {
    return await loading.present();
  }

  ionViewWillEnter() {
    this.refreshCards();
  }

  ngOnInit() {
    this.refreshCards();
  }

  async refreshCards() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoadingIt(loading);

    this.Service.getCardsUser().subscribe(
      cards => {
        this.cards = cards;
        loading.dismiss();
      },
      err => {
        console.log('err : add card to user', err);
        loading.dismiss();
      }
    );
  }

  async deleteCard(id) {
    const alert = await this.alertController.create({
      header: 'Supprimer un moyen de paiement ',
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
            this.Service.deleteCardsUser(id).subscribe(
              res => {
                this.refreshCards();
              },
              err => {
                console.log('err : add card to user', err);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModalCreatePayment() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: CreatePaymentMethodsPage,
      componentProps: {
        aParameter: true,
        otherParameter: new Date()
      }
    });

    modal.onDidDismiss().then(() => {
      this.refreshCards();
    });

    await modal.present();
  }
}
