import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-providers-confirm',
  templateUrl: './providers-confirm.page.html',
  styleUrls: ['./providers-confirm.page.scss']
})
export class ProvidersConfirmPage  {
 providers = [];
  providersUntouched = [];

  public searchTerm: string = '';
  public loadingComponent: any;

  constructor(
    public service: Service,
    public loadingController: LoadingController
  ) {
    this.presentLoading();
  }

 ionViewWillEnter() {
    this.service.getNotConfirmedProviders().subscribe(
      providers => {
        this.providers = providers;
        this.providersUntouched = providers;
        this.dismissLoading();
      },
      err => {
        this.dismissLoading();
        console.log('err : providers', err);
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
    this.providers = this.providersUntouched.filter(provider => {
      let SearchKeys =
        provider.email.toLowerCase() +
        provider.nom_de_famille.toLowerCase() +
        provider.prenom.toLowerCase() +
        provider.numero.toLowerCase() +
        provider.path_txt_cin.toLowerCase();
      return SearchKeys.indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
}
