import { Component } from '@angular/core';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage  {
  userData:any;

  constructor(public Service: Service) {}

  ionViewWillEnter() {
    this.Service.getUserProfile().subscribe(
      userProfile => {
        this.userData = userProfile;
      },
      err => {
        console.log('err : userProfile', err);
      }
    );
  }
}
