import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from '@ionic-native/Camera/ngx';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import {
  ToastController,
  NavController,
  Platform,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { Router, ActivatedRoute } from '@angular/router';

import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss']
})
export class AddProductPage implements OnInit {
  submitted = false;
  addNewProductForm: FormGroup;
  disponible: Boolean = true;
  category: any;
  image = [];
  loading = false;
  loadingComponent = null;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public camera: Camera,
    public toastController: ToastController,
    public file: File,
    public http: HttpClient,
    public webview: WebView,
    public storage: Storage,
    public plt: Platform,
    public ref: ChangeDetectorRef,
    public filePath: FilePath,
    public navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.prepareForm();
  }

  onSubmitAddNewProductForm(frm: any) {
    this.submitted = true;
    if (this.addNewProductForm.invalid) {
      return;
    }
    if (this.image.length !== 0) {
      this.startUpload(this.image[0]);
    } else {
      this.presentAlert('Veuillez télécharger une image');
    }
  }

  prepareForm() {
    this.addNewProductForm = this.formBuilder.group(
      {
        category: [null, [Validators.required]],
        title: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(32)
          ]
        ],
        desc: [null, []],
        status: [null, []],
        price: [null, [Validators.required]]
      },
      {}
    );
  }

  get frm() {
    return this.addNewProductForm.controls;
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
      let statusForm = '';
      if (this.disponible === true) {
        statusForm = 'disponible';
      } else {
        statusForm = 'pas disponible';
      }
      formData.append('cat', this.frm.category.value);
      formData.append('title', this.frm.title.value);
      formData.append('price', this.frm.price.value);
      if (this.frm.desc.value === null) {
        formData.append('desc', '');
      } else {
        formData.append('desc', this.frm.desc.value);
      }
      formData.append('status', statusForm);
      formData.append('image', imgBlob, file.name);

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
      .post(`${environment.bffUrl}/api/add-product-to-provider`, formData, {
        headers: new HttpHeaders({
          'x-auth-token': localStorage.getItem('currentUserToken')
        })
      })
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(
        res => {
          if (res['id']) {
            this.presentToast('Creation terminé.');
            this.navCtrl.navigateForward(['/provider-app-use/products']);
          } else {
            this.presentToast(res);
          }
        },
        err => {
          console.log(err);
          this.presentAlert(err.error.msg);
        }
      );
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

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
}
