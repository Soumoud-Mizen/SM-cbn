import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-admin-app-use',
  templateUrl: './admin-app-use.page.html',
  styleUrls: ['./admin-app-use.page.scss'],
})
export class AdminAppUsePage implements OnInit {

  constructor(public menu: MenuController) { }

  ngOnInit() {
  }

 ionViewDidEnter() {
    // this.menu.swipeGesture(true, 'consumerMenu');
    this.menu.enable(false, 'consumerMenu');
    this.menu.enable(true, 'adminMenu');
    this.menu.enable(false, 'providerMenu');
  }
 
}
