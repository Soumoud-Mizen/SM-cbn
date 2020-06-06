import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Service } from '../../../services/service';
import {
  LoadingController,
  NavController,
  AlertController
} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.page.html',
  styleUrls: ['./provider.page.scss']
})
export class ProviderPage implements OnInit {
  products = [];
  gouts = [];
  offres = [];
  shows = [];
  loadingComponent: any;
  provID;
  provTitle;
  slideOpts;
  isDeliveryTime: Boolean = false;
  prov = <any>{};
  settingsData = <any>{};
  cards = [];

  constructor(
    public route: ActivatedRoute,
    public service: Service,
    public loadingController: LoadingController,
    public iab: InAppBrowser,
    public navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.presentLoading();
    this.slideOpts = {
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94
      },
      on: {
        beforeInit: function() {
          const swiper = this;
          swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

          const overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            resistanceRatio: 0,
            spaceBetween: 0,
            centeredSlides: false,
            virtualTranslate: true
          };

          this.params = Object.assign(this.params, overwriteParams);
          this.originalParams = Object.assign(
            this.originalParams,
            overwriteParams
          );
        },
        setTranslate: function() {
          const swiper = this;
          const {
            $el,
            $wrapperEl,
            slides,
            width: swiperWidth,
            height: swiperHeight,
            rtlTranslate: rtl,
            size: swiperSize
          } = swiper;
          const params = swiper.params.cubeEffect;
          const isHorizontal = swiper.isHorizontal();
          const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
          let wrapperRotate = 0;
          let $cubeShadowEl;
          if (params.shadow) {
            if (isHorizontal) {
              $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
              if ($cubeShadowEl.length === 0) {
                $cubeShadowEl = swiper.$(
                  '<div class="swiper-cube-shadow"></div>'
                );
                $wrapperEl.append($cubeShadowEl);
              }
              $cubeShadowEl.css({ height: `${swiperWidth}px` });
            } else {
              $cubeShadowEl = $el.find('.swiper-cube-shadow');
              if ($cubeShadowEl.length === 0) {
                $cubeShadowEl = swiper.$(
                  '<div class="swiper-cube-shadow"></div>'
                );
                $el.append($cubeShadowEl);
              }
            }
          }

          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            let slideIndex = i;
            if (isVirtual) {
              slideIndex = parseInt(
                $slideEl.attr('data-swiper-slide-index'),
                10
              );
            }
            let slideAngle = slideIndex * 90;
            let round = Math.floor(slideAngle / 360);
            if (rtl) {
              slideAngle = -slideAngle;
              round = Math.floor(-slideAngle / 360);
            }
            const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
            let tx = 0;
            let ty = 0;
            let tz = 0;
            if (slideIndex % 4 === 0) {
              tx = -round * 4 * swiperSize;
              tz = 0;
            } else if ((slideIndex - 1) % 4 === 0) {
              tx = 0;
              tz = -round * 4 * swiperSize;
            } else if ((slideIndex - 2) % 4 === 0) {
              tx = swiperSize + round * 4 * swiperSize;
              tz = swiperSize;
            } else if ((slideIndex - 3) % 4 === 0) {
              tx = -swiperSize;
              tz = 3 * swiperSize + swiperSize * 4 * round;
            }
            if (rtl) {
              tx = -tx;
            }

            if (!isHorizontal) {
              ty = tx;
              tx = 0;
            }

            const transform$$1 = `rotateX(${
              isHorizontal ? 0 : -slideAngle
            }deg) rotateY(${
              isHorizontal ? slideAngle : 0
            }deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
            if (progress <= 1 && progress > -1) {
              wrapperRotate = slideIndex * 90 + progress * 90;
              if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
            }
            $slideEl.transform(transform$$1);
            if (params.slideShadows) {
              // Set shadows
              let shadowBefore = isHorizontal
                ? $slideEl.find('.swiper-slide-shadow-left')
                : $slideEl.find('.swiper-slide-shadow-top');
              let shadowAfter = isHorizontal
                ? $slideEl.find('.swiper-slide-shadow-right')
                : $slideEl.find('.swiper-slide-shadow-bottom');
              if (shadowBefore.length === 0) {
                shadowBefore = swiper.$(
                  `<div class="swiper-slide-shadow-${
                    isHorizontal ? 'left' : 'top'
                  }"></div>`
                );
                $slideEl.append(shadowBefore);
              }
              if (shadowAfter.length === 0) {
                shadowAfter = swiper.$(
                  `<div class="swiper-slide-shadow-${
                    isHorizontal ? 'right' : 'bottom'
                  }"></div>`
                );
                $slideEl.append(shadowAfter);
              }
              if (shadowBefore.length)
                shadowBefore[0].style.opacity = Math.max(-progress, 0);
              if (shadowAfter.length)
                shadowAfter[0].style.opacity = Math.max(progress, 0);
            }
          }
          $wrapperEl.css({
            '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
            '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
            '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
            'transform-origin': `50% 50% -${swiperSize / 2}px`
          });

          if (params.shadow) {
            if (isHorizontal) {
              $cubeShadowEl.transform(
                `translate3d(0px, ${swiperWidth / 2 +
                  params.shadowOffset}px, ${-swiperWidth /
                  2}px) rotateX(90deg) rotateZ(0deg) scale(${
                  params.shadowScale
                })`
              );
            } else {
              const shadowAngle =
                Math.abs(wrapperRotate) -
                Math.floor(Math.abs(wrapperRotate) / 90) * 90;
              const multiplier =
                1.5 -
                (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2 +
                  Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2);
              const scale1 = params.shadowScale;
              const scale2 = params.shadowScale / multiplier;
              const offset$$1 = params.shadowOffset;
              $cubeShadowEl.transform(
                `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight /
                  2 +
                  offset$$1}px, ${-swiperHeight /
                  2 /
                  scale2}px) rotateX(-90deg)`
              );
            }
          }

          const zFactor =
            swiper.browser.isSafari || swiper.browser.isUiWebView
              ? -swiperSize / 2
              : 0;
          $wrapperEl.transform(
            `translate3d(0px,0,${zFactor}px) rotateX(${
              swiper.isHorizontal() ? 0 : wrapperRotate
            }deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`
          );
        },
        setTransition: function(duration) {
          const swiper = this;
          const { $el, slides } = swiper;
          slides
            .transition(duration)
            .find(
              '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
            )
            .transition(duration);
          if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
            $el.find('.swiper-cube-shadow').transition(duration);
          }
        }
      }
    };
  }

  openLink(url) {
    const browser = this.iab.create(url);
  }

  async presentLoadingIt(loading) {
    return await loading.present();
  }

  async makePayment(product: any) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoadingIt(loading);

    this.service.getCardsUser().subscribe(
      cards => {
        if (cards.length === 0) {
          loading.dismiss();
          this.navCtrl.navigateForward(['/consumer-app-use/payment-methods']);
          return;
        }
        this.cards = cards;
        let arrRad = [];
        let isFirst = true;

        cards.forEach(element => {
          arrRad.push({
            name: 'radio' + element._id,
            type: 'radio',
            label: '***' + element.last4 + ' ' + element.brand,
            value: element._id,
            checked: isFirst
          });
          isFirst = !true;
        });

        this.presentAlertRadio(arrRad, product);
        loading.dismiss();
      },
      err => {
        loading.dismiss();
        console.log('err : add card to user', err);
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Vous acheter ce produit avec succès',
      message: 'Voire <strong>la commande</strong> ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.navCtrl.navigateForward(['/consumer-app-use/orders-history']);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertRadio(inputs, product) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    const alert = await this.alertController.create({
      header: 'Cards',
      subHeader: 'Make payment for ' + product.title,
      message: 'Confirm for ' + product.price + '€',

      inputs,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.presentLoadingIt(loading);

            if (this.cards.length === 0) {
              loading.dismiss();
              this.navCtrl.navigateForward([
                '/consumer-app-use/payment-methods'
              ]);
              return;
            }

            let card = this.cards.filter(card => card._id === data);
            let card_id = card[0]._id;

            let payment = {
              amount: product.price,
              currency: 'EUR',
              description:
                product.title +
                ' - ' +
                product.price +
                '€ - ' +
                this.prov.providerName,
              card_id,
              provider_id: this.provID,
              provider_name: this.prov.providerName,
              product_id: product._id
            };

            this.service.makePaymentForProduct(payment).subscribe(
              res => {
                console.log(
                  '===============res====makePaymentForProduct================='
                );
                console.log(res);
                console.log('====================================');
                loading.dismiss();
              },
              err => {
                loading.dismiss();
                console.log('err : makePaymentForProduct', err);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      /***
       * Hard coded ID you can replace by //this.provID = params['selectedProviderID'];
       */
      this.provID = params['selectedProviderID'];
      this.provTitle = params['nearProviderTitle'];
      // this.provID = '5ded41b510a808513403bb59';

      this.service.getPublicSettings().subscribe(
        res => {
          this.settingsData = res;
          this.service.getProviderForConsumer(this.provID).subscribe(
            prov => {
              this.prov = prov;
              this.service
                .getProductsForConsumerByIDProvider(this.provID)
                .subscribe(
                  products => {
                    this.products = products;
                    this.shows = products;

                    this.gouts = this.products.filter(provider => {
                      return (
                        provider.cat.toLowerCase() === 'Goûts'.toLowerCase()
                      );
                    });

                    this.offres = this.products.filter(provider => {
                      return (
                        provider.cat.toLowerCase() === 'Offre'.toLowerCase()
                      );
                    });

                    this.dismissLoading();
                  },
                  err => {
                    this.dismissLoading();
                    console.log('err : consumers', err);
                  },
                  () => {}
                );
            },
            err => {
              this.dismissLoading();
              console.log('err : getProviderForConsumer', err);
            },
            () => {}
          );
        },
        err => {
          this.dismissLoading();
          console.log('err : consumers', err);
        },
        () => {}
      );
    });
  }

  setThe(cat) {
    switch (cat) {
      case 'gouts':
        this.shows = this.gouts;
        this.isDeliveryTime = false;

        break;

      case 'offre':
        this.shows = this.offres;
        this.isDeliveryTime = false;

        break;

      case 'all':
        this.shows = this.products;
        this.isDeliveryTime = false;

        break;

      default:
        this.isDeliveryTime = true;
        break;
    }
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
}
