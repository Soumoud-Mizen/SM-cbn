import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.page.html',
  styleUrls: ['./consumers.page.scss']
})
export class ConsumersPage {
  consumers = [];
  consumersUntouched = [];

  public searchTerm: string = '';
  public loadingComponent: any;

  constructor(
    public service: Service,
    public loadingController: LoadingController
  ) {
    this.presentLoading();
  }

  ionViewWillEnter() {
    this.service.getConsumersForAdmin().subscribe(
      consumers => {
        this.consumers = consumers;
        this.consumersUntouched = consumers;
        this.dismissLoading();
      },
      err => {
        this.dismissLoading();
        console.log('err : consumers', err);
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

  setFilteredItems() {
    this.consumers = this.consumersUntouched.filter(consumer => {
      let SearchKeys =
        consumer.email.toLowerCase() +
        consumer.nom_de_famille.toLowerCase() +
        consumer.prenom.toLowerCase() +
        consumer.numero.toLowerCase() +
        consumer.path_txt_cin.toLowerCase();
      return SearchKeys.indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
}
