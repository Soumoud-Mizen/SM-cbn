import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(public navCtrl: NavController, public menu: MenuController) {}

  openRegisterPage(role) {
    let navigationExtras: NavigationExtras = {
      queryParams: { role }
    };
    this.navCtrl.navigateForward(['/register-consumer'], navigationExtras);
  }

  ionViewDidEnter() {
    // this.menu.swipeGesture(true, 'consumerMenu');
    // If you have more than one side menu, use the id like below
    //  this.menu.swipeGesture(false, 'consumerMenu');
    //  this.menu.swipeGesture(false, 'adminMenu');

    this.menu.enable(false, 'consumerMenu');
    this.menu.enable(false, 'adminMenu');
    this.menu.enable(false, 'providerMenu');
  }

  ionViewWillLeave() {
    // Don't forget to return the swipe to normal, otherwise
    // the rest of the pages won't be able to swipe to open menu
    //this.menu.swipeEnable(true);
    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
  }
}
