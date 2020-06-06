import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from '@ionic-native/Camera/ngx';
import {
  NavController,
  ActionSheetController,
  ToastController,
  Platform,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { first } from 'rxjs/operators';

import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../../environments/environment';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-register-consumer',
  templateUrl: './register-consumer.page.html',
  styleUrls: ['./register-consumer.page.scss']
})
export class RegisterConsumerPage implements OnInit {
  submitted = false;
  authFormStep1: FormGroup;
  returnUrl: string;
  loading = false;
  loadingComponent = null;
  step: number = 1;
  image = [];
  role = null;
  lat: any;
  lng: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public camera: Camera,
    public file: File,
    public http: HttpClient,
    public webview: WebView,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public storage: Storage,
    public plt: Platform,
    public ref: ChangeDetectorRef,
    public filePath: FilePath,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public androidPermissions: AndroidPermissions,
    public navCtrl: NavController
  ) {
    // this.router.navigate(['/']);
  }

  async ngOnInit() {
    await this.prepareModules();
    await this.checkGPSPermission();
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
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getUserPosition();
        },
        error =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }

  getUserPosition() {
    this.geolocation.getCurrentPosition().then(
      position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      },
      err => {
        alert('err ' + err);
      }
    );
  }

  prepareModules() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'];
    });

    // this.plt.ready().then(() => {
    //   this.loadStoredImages();
    // });

    if (this.role === 'provider-not-confirmed') {
      this.authFormStep1 = this.formBuilder.group(
        {
          providerName: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern('[A-Za-z0-9^s*S+(?: S+)*s*$]{3,32}')
            ]
          ],
          nom_de_famille: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern('[A-Za-z0-9^s*S+(?: S+)*s*$]{3,32}')
            ]
          ],
          prenom: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern('[A-Za-z0-9^s*S+(?: S+)*s*$]{3,32}')
            ]
          ],
          email: [
            null,
            [
              Validators.required,
              Validators.email,
              Validators.pattern(
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/g
              )
            ]
          ],
          password: [null, [Validators.required, Validators.minLength(6)]],
          confirm_password: [
            null,
            [Validators.required, Validators.minLength(6)]
          ],
          numero: [
            null,
            [
              Validators.required,
              Validators.pattern(/^((\+)33|0033|0)[1-9](\d{2}){4}$/g)
            ]
          ],
          cin: [null, [Validators.required, Validators.pattern(/[0-9]{6,}/)]],
          code_prom: [null, null]
        },
        {}
      );
    } else {
      this.authFormStep1 = this.formBuilder.group(
        {
          nom_de_famille: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern('[A-Za-z0-9^s*S+(?: S+)*s*$]{3,32}')
            ]
          ],
          prenom: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern('[A-Za-z0-9^s*S+(?: S+)*s*$]{3,32}')
            ]
          ],
          email: [
            null,
            [
              Validators.required,
              Validators.email,
              Validators.pattern(
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/g
              )
            ]
          ],
          password: [null, [Validators.required, Validators.minLength(6)]],
          confirm_password: [
            null,
            [Validators.required, Validators.minLength(6)]
          ],
          numero: [
            null,
            [
              Validators.required,
              Validators.pattern(/^((\+)33|0033|0)[1-9](\d{2}){4}$/g)
            ]
          ],
          cin: [null, [Validators.required, Validators.pattern(/[0-9]{6,}/)]],
          code_prom: [null, null]
        },
        {}
      );
    }

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/main-app-use';
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.image = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.image.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  loadfromLibrary() {
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  useCamera() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (
        this.plt.is('android') &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(
            imagePath.lastIndexOf('/') + 1,
            imagePath.lastIndexOf('?')
          );
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(
          correctPath,
          currentName,
          this.createFileName()
        );
      }
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          this.updateStoredImages(newFileName);
        },
        error => {
          this.presentToast('Erreur lors du stockage du fichier.');
        }
      );
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(image => {
      let arr = JSON.parse(image);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.image = [newEntry, ...this.image];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry, position) {
    this.image.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(image => {
      let arr = JSON.parse(image);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(
        0,
        imgEntry.filePath.lastIndexOf('/') + 1
      );

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('Image supprimée.');
      });
    });
  }

  onSubmitStep2() {
    if (this.image.length !== 0) {
      this.startUpload(this.image[0]);
    } else {
      this.presentAlert(
        "Veuillez télécharger une copie de votre pièce d'identité"
      );
    }
  }

  startUpload(imgEntry) {
    this.file
      .resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file));
      })
      .catch(err => {
        this.presentToast("Erreur lors de la lecture de l'image.");
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('nom_de_famille', this.frm.nom_de_famille.value);
      formData.append('prenom', this.frm.prenom.value);
      formData.append('email', this.frm.email.value);
      formData.append('mot_de_passe', this.frm.password.value);
      formData.append('numero', this.frm.numero.value);
      formData.append('path_txt_cin', this.frm.cin.value);
      if (this.frm.code_prom.value) {
        formData.append('code_prom', this.frm.code_prom.value);
      }
      formData.append('image', imgBlob, file.name);
      formData.append('role', this.role);
      if (this.role === 'provider-not-confirmed') {
        formData.append('lat', this.lat);
        formData.append('lng', this.lng);
        formData.append('providerName', this.frm.providerName.value);
      }
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Creation en cours...'
    });
    await loading.present();

    this.http
      .post(`${environment.bffUrl}/api/sign-up`, formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(
        res => {
          if (res['msg']) {
            this.presentToast('Creation terminé avec succès.');
            this.navCtrl.navigateForward(['/login']);
          } else {
            this.presentToast(res['msg']);
          }
        },
        err => {
          console.log(err.message);
          alert(err.message);
        }
      );
  }

  checkPwdIsSame(): boolean {
    const pwd = this.frm.password.value;
    const cpwd = this.frm.confirm_password.value;
    return pwd !== cpwd;
  }

  onSubmitStep1(value: any): void {
    this.submitted = true;
    // Stop if the form validation has failed
    if (this.authFormStep1.invalid) {
      return;
    }

    this.step = 2;
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Attention',
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  get frm() {
    return this.authFormStep1.controls;
  }


}
