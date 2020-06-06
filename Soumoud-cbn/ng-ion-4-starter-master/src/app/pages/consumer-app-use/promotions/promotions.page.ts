import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss']
})
export class PromotionsPage implements OnInit {
  userData: any;
  promotions = [];
  constructor(public socialSharing: SocialSharing, public Service: Service) {}

  letShare() {
    this.Service.getUserProfile().subscribe(
      userProfile => {
        this.Service.getPromotionsForConsumer().subscribe(
          promotions => {
            this.promotions = promotions;
          },
          err => {
            console.log('err : getPromotionsForConsumer', err);
          }
        );

        this.userData = userProfile;

        this.socialSharing
          .share(
            'GAGNEZ VOTRE PREMIER BONUS',
            "Economiez 4€ a chaque foid que l'un de vos invitée essaie NG ION 4 STARTER, code promotion : << " +
              userProfile._id +
              " >> copier et coller dans la page d'inscription",
            null,
            'http://www.exemple.com/TOKEN'
          )
          .then(() => {})
          .catch(() => {
            console.log(
              '=============Sharing is NOT possible======================='
            );
          });
      },
      err => {
        console.log('err : userProfile', err);
      }
    );
  }

  ngOnInit() {}
}
