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

import { Service } from '../../../services/service';

import { Router, ActivatedRoute, Params } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss']
})
export class EditUserPage implements OnInit {
  submitted = false;
  authFormStep1: FormGroup;
  loadingComponent: any;
  userData: any;
  loading = false;
  step: number = 1;
  image = [];
  role: any;
  id: any;

  constructor(
    public service: Service,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public camera: Camera,
    public file: File,
    public http: HttpClient,
    public webview: WebView,
    public toastController: ToastController,
    public storage: Storage,
    public plt: Platform,
    public ref: ChangeDetectorRef,
    public filePath: FilePath,
    public navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.getParams();
    await this.prepareModules();
    await this.loadProfile();
  }

  getParams() {
    this.route.params.subscribe(
      (params: Params) => {
        this.role = params['role'];
        this.id = params['id'];
      },
      err => {
        console.log('err : Params', err);
      }
    );
  }

  prepareModules() {
    if (this.role === 'provider') {
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
          password: [null, []],
          confirm_password: [null, []],
          numero: [
            null,
            [
              Validators.required,
              Validators.pattern(/^((\+)33|0033|0)[1-9](\d{2}){4}$/g)
            ]
          ],
          cin: [null, [Validators.required, Validators.pattern(/[0-9]{6,}/)]]
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
          password: [, []],
          confirm_password: [, []],
          numero: [
            null,
            [
              Validators.required,
              Validators.pattern(/^((\+)33|0033|0)[1-9](\d{2}){4}$/g)
            ]
          ],
          cin: [null, [Validators.required, Validators.pattern(/[0-9]{6,}/)]]
        },
        {}
      );
    }
  }

  loadProfile() {
    this.presentLoading();
    this.service.getUserProfileByID(this.id).subscribe(
      userProfile => {
        this.userData = userProfile;
        this.dismissLoading();
        this.patchModules();
      },
      err => {
        console.log('err : getUserProfileByID', err);
        this.dismissLoading();
      }
    );
  }

  patchModules() {
    if (this.role === 'provider') {
      this.authFormStep1.setValue({
        providerName: this.userData.providerName,
        nom_de_famille: this.userData.nom_de_famille,
        prenom: this.userData.prenom,
        email: this.userData.email,
        numero: this.userData.numero,
        cin: this.userData.path_txt_cin,
        password: null,
        confirm_password: null
      });
    } else {
      this.authFormStep1.setValue({
        nom_de_famille: this.userData.nom_de_famille,
        prenom: this.userData.prenom,
        email: this.userData.email,
        numero: this.userData.numero,
        cin: this.userData.path_txt_cin,
        password: null,
        confirm_password: null
      });
    }
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
      const formData = new FormData();
      if (this.role === 'provider') {
        formData.append('providerName', this.frm.providerName.value);
      }
      if (this.frm.nom_de_famille.value) {
        formData.append('nom_de_famille', this.frm.nom_de_famille.value);
      }
      if (this.frm.prenom.value) {
        formData.append('prenom', this.frm.prenom.value);
      }
      if (this.frm.email.value) {
        formData.append('email', this.frm.email.value);
      }
      if (this.frm.password.value !== '' && this.frm.password.value !== null) {
        formData.append('mot_de_passe', this.frm.password.value);
      }
      if (this.frm.numero.value) {
        formData.append('numero', this.frm.numero.value);
      }
      if (this.frm.cin.value) {
        formData.append('path_txt_cin', this.frm.cin.value);
      }
      this.uploadImageData(formData);
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
      if (this.frm.nom_de_famille.value) {
        formData.append('nom_de_famille', this.frm.nom_de_famille.value);
      }
      if (this.role === 'provider') {
        formData.append('providerName', this.frm.providerName.value);
      }
      if (this.frm.prenom.value) {
        formData.append('prenom', this.frm.prenom.value);
      }
      if (this.frm.email.value) {
        formData.append('email', this.frm.email.value);
      }
      if (this.frm.password.value !== '' && this.frm.password.value !== null) {
        formData.append('mot_de_passe', this.frm.password.value);
      }
      if (this.frm.numero.value) {
        formData.append('numero', this.frm.numero.value);
      }
      if (this.frm.cin.value) {
        formData.append('path_txt_cin', this.frm.cin.value);
      }
      if (this.image.length !== 0) {
        console.log('=============this.image=======================');
        console.log(this.image);
        console.log('====================================');
        formData.append('image', imgBlob, file.name);
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
      .post(
        `${environment.bffUrl}/api/update-user-for-admin/${this.userData._id}`,
        formData,
        {
          headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('currentUserToken')
          })
        }
      )
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(
        res => {
          this.presentToast('la modification a été effectuée.');
          if (this.role === 'provider') {
            this.navCtrl.navigateForward(['/admin-app-use/providers']);
          } else {
            this.navCtrl.navigateForward(['/admin-app-use/consumers']);
          }
        },
        err => {
          console.log(err);
          //alert(err);
        }
      );
  }

  checkPwdIsSame(): boolean {
    let pwd = this.frm.password.value;
    if (pwd === null || pwd === '') {
      pwd = null;
    }
    let cpwd = this.frm.confirm_password.value;
    if (cpwd === null || cpwd === '') {
      cpwd = null;
    }
    return pwd !== cpwd;
  }

  onSubmitStep1(value: any): void {
    this.submitted = true;
    // Stop if the form validation has failed
    if (this.authFormStep1.invalid || this.checkPwdIsSame()) {
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
