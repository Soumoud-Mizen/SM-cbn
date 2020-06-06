import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Service } from '../../../services/service';
import { AppRate } from '@ionic-native/app-rate/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss']
})
export class AboutPage implements OnInit {
  urlML;
  constructor(
    public iab: InAppBrowser,
    public service: Service,
    public appRate: AppRate
  ) {}

  openRate() {
    this.appRate.preferences.storeAppURL = {
      ios: '284815942',
      android: 'market://details?id=com.google.android.apps.translate',
      windows: 'ms-windows-store://review/?ProductId=9pb2mz1zmb1s'
    };

    this.appRate.promptForRating(true);
  }

  openLink(url) {
    const browser = this.iab.create(url);
  }

  ngOnInit() {
    this.service.getPublicSettings().subscribe(
      res => {
        this.urlML = res['settings']['adminLinkMentionsLegales'];
      },
      err => {
        console.log('err : getPublicSettings', err);
      },
      () => {}
    );
  }
}
