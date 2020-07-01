import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  MenuController,
  Platform
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  ILatLng,
  Marker,
  BaseArrayClass,
  Environment,
  GoogleMapOptions
} from '@ionic-native/google-maps';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NavigationExtras } from '@angular/router';
import { Service } from '../../services/service';

declare var google;

@Component({
  selector: 'app-consumer-app-use',
  templateUrl: './consumer-app-use.page.html',
  styleUrls: ['./consumer-app-use.page.scss']
})
export class ConsumerAppUsePage implements OnInit {
  map: GoogleMap;
  nearProviderIndex: any;
  arrayMarkers: any;
  nearProviderTitle: string = '';
  selectedProviderID: string = '';
  loading: boolean;
  public providers: any;

  public mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  constructor(
    public router: Router,
    public menu: MenuController,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public alertController: AlertController,
    public navCtrl: NavController,
    public zone: NgZone,
    public service: Service
  ) {
    this.loading = true;
  }

  async ngOnInit() {
    // get array of markers
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();

    // await this.checkGPSPermission();

    await this.loadMap();
  }

  async presentAlertConfirm(prov) {
    const alert = await this.alertController.create({
      header: 'Confirmer',
      message: 'Faire appelle à <strong>' + prov + '</strong> ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        {
          text: 'Je confirme',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                selectedProviderID: this.selectedProviderID,
                nearProviderTitle: this.nearProviderTitle
              }
            };
            this.navCtrl.navigateForward(
              ['/consumer-app-use/provider'],
              navigationExtras
            );
          }
        }
      ]
    });

    await alert.present();
  }

  //Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        result => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert(
                'requestPermission Error requesting location permissions ' +
                error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          this.loadMap();
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        error =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }

  loadMap() {
    // This code is necessary for browser
    if (Environment) {
      Environment.setEnv({
        API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBgRCFY8c0I42fnMgdY6tEYwVoBrDl_GSs',
        API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBgRCFY8c0I42fnMgdY6tEYwVoBrDl_GSs'
      });
    }


    this.service.getProvidersForConsumer().subscribe(
      providers => {
       
        this.providers = providers;
        this.arrayMarkers = [];

        providers.map(prv => {
          this.arrayMarkers.push({
            __id: prv._id,
            position: {
              lat: prv.lat,
              lng: prv.lng
            },
            title: prv.providerName,
            icon: null
          });
        });
        
      },
      err => {
        console.error('error get providers: ' + err);
      },
      () => {
        this.geolocation.getCurrentPosition().then(
          position => {
            // let lat = position.coords.latitude;
            // let lng = position.coords.longitude;
            // Fake
            let lat = 48.857341;
            let lng = 2.352316;

            let R = 6371; // radius of earth in km
            let distances = [];
            let closest = -1;

            for (let i = 0; i < this.arrayMarkers.length; i++) {
              let mlat = this.arrayMarkers[i].position.lat;
              let mlng = this.arrayMarkers[i].position.lng;
              let dLat = ((mlat - lat) * Math.PI) / 180;
              let dLong = ((mlng - lng) * Math.PI) / 180;
              let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat * Math.PI) / 180) *
                Math.cos((lat * Math.PI) / 180) *
                Math.sin(dLong / 2) *
                Math.sin(dLong / 2);
              let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              let d = R * c;
              distances[i] = d;
              if (closest == -1 || d < distances[closest]) {
                closest = i;
              }
            }
            if (this.arrayMarkers[closest].title !== 'Votre position') {
              this.nearProviderIndex = closest;
              this.nearProviderTitle = this.arrayMarkers[closest].title;
            }

            this.arrayMarkers.push({
              position: {
                // Fake
                //  lat: position.coords.latitude,
                //  lng: position.coords.longitude
                lat: '48.857341',
                lng: '2.352316'
              },
              title: 'Votre position',
              icon: {
                url: 'http://www.google.com/mapfiles/dd-start.png'
              }
            });

            let POINTS: BaseArrayClass<any> = new BaseArrayClass<any>(
              this.arrayMarkers
            );

            let bounds: ILatLng[] = POINTS.map((data: any, idx: number) => {
              // console.log('data', data);
              // console.log('idx', idx);
              return data.position;
            });

            let mapOptions: GoogleMapOptions = {
              camera: {
                target: bounds,
                zoom: 5,
                tilt: 30
              },
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              styles: this.mapStyle
            };

            this.map = GoogleMaps.create('map_canvas', mapOptions);

            POINTS.forEach((data: any) => {
              // data.disableAutoPan = true;
              let marker: Marker = this.map.addMarkerSync(data);
              let markeRX: Marker = <Marker>marker;
              let tiX: any = marker.get('title');

              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(params => {
                let markeR: Marker = <Marker>params[1];
                let ti: any = marker.get('title');
                let id_prov: any = markeRX.get('__id');

                this.zone.run(() => {
                  this.selectedProviderID = id_prov;
                  this.nearProviderTitle = ti;
                });

                if (ti !== 'Votre position') {
                  // this.presentAlertConfirm(ti);
                  //this.onMarkerClick(params);
                }
              });

              if (tiX === this.nearProviderTitle) {
                markeRX.trigger(GoogleMapsEvent.MARKER_CLICK);
              }
            });

            this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
              this.map
                .moveCamera({
                  target: {
                    lat: this.arrayMarkers[this.nearProviderIndex].position.lat,
                    lng: this.arrayMarkers[this.nearProviderIndex].position.lng
                  },
                  zoom: 18,
                  tilt: 60,
                  bearing: 140
                })
                .then(() => {
                  this.loading = false;
                });
            });
          },
          err => {
            alert('err ' + err);
            this.loading = false;
          }
        );
        // end : getCurrentPosition
      }
    );
  }

  ionViewDidEnter() {
    // this.menu.swipeGesture(true, 'consumerMenu');
    this.menu.enable(true, 'consumerMenu');
    this.menu.enable(false, 'adminMenu');
    this.menu.enable(false, 'providerMenu');
  }

  ionViewWillLeave() {
    this.map.setDiv()
  }

}
