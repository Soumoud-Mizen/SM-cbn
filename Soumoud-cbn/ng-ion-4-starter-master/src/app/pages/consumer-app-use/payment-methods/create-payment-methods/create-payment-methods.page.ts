import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Service } from '../../../../services/service';
import { ModalController, LoadingController } from '@ionic/angular';
declare var Stripe;

@Component({
  selector: 'app-create-payment-methods',
  templateUrl: './create-payment-methods.page.html',
  styleUrls: ['./create-payment-methods.page.scss']
})
export class CreatePaymentMethodsPage implements OnInit {
  stripe = Stripe(environment.stripe.PUBLISHABLE_KEY);
  card: any;

  constructor(
    public Service: Service,
    public modalCtrl: ModalController,
    public loadingController: LoadingController
  ) {}

  async presentLoadingIt(loading) {
    return await loading.present();
  }

  ngOnInit() {
    this.setupStripe();
  }

  async setupStripe() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });
    console.log(this.card);
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          this.presentLoadingIt(loading);
          this.Service.addCardToUser({
            brand: result.source.card.brand,
            country: result.source.card.country,
            exp_month: result.source.card.exp_month,
            exp_year: result.source.card.exp_year,
            last4: result.source.card.last4,
            card_token: result.source.id
          }).subscribe(
            cardId => {
              loading.dismiss();
              this.modalCtrl.dismiss();
            },
            err => {
              console.log('err : add card to user', err);
              loading.dismiss();
            }
          );

          // this.makePayment(result.id);
        }
      });
    });
  }
}
