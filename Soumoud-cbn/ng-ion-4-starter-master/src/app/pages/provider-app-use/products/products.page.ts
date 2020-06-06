import { Component } from '@angular/core';
import { Service } from '../../../services/service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage {
  public searchTerm: string = '';
  public productsUntouched: any;
  public products: any;
  public loadingComponent: any;

  constructor(
    public Service: Service,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) {
    this.presentLoading();
  }

  ionViewWillEnter() {
    this.Service.getProductsForCurrentProvider().subscribe(
      products => {
        this.products = products;
        this.productsUntouched = products;
        this.dismissLoading();
      },
      err => {
        this.dismissLoading();
        console.log('err : products', err);
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
    this.products = this.productsUntouched.filter(product => {
      let SearchKeys =
        product.title.toLowerCase() +
        product.desc.toLowerCase() +
        product.price.toLowerCase() +
        product.status.toLowerCase() +
        product.cat.toLowerCase();
      return SearchKeys.indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  addNewOne() {
     this.navCtrl.navigateForward(['/provider-app-use/products/add-product']);
  }
}
