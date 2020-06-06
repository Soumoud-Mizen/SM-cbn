import { Component, OnInit } from '@angular/core';
import { Service } from '../../../../services/service';

import {
  LoadingController,
  NavController,
  AlertController
} from '@ionic/angular';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {
  submitted = false;
  faqForm: FormGroup;
  loadingComponent: any;

  constructor(
    public formBuilder: FormBuilder,
    public service: Service,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) {
    this.faqForm = this.formBuilder.group(
      {
        title: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50)
          ]
        ],
        detail: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(1000)
          ]
        ]
      },
      {}
    );
  }

  get frm() {
    return this.faqForm.controls;
  }

  ngOnInit() {}

  onSubmitFaqForm(value: any): void {
    this.submitted = true;
    // Stop if the form validation has failed
    if (this.faqForm.invalid) {
      return;
    }
    this.addFAQ();
  }

  addFAQ() {
    this.presentLoading();
    this.service
      .addFAQ({ title: this.frm.title.value, detail: this.frm.detail.value })
      .subscribe(
        res => {
          this.submitted = false;
          this.faqForm.setValue({
            title: null,
            detail: null
          });
          this.dismissLoading();
          this.navCtrl.navigateForward(['/admin-app-use/faq']);
        },
        err => {
          if (err.error['msg']) {
            this.presentAlert(err.error['msg']);
          } else {
            this.presentAlert(err.message);
          }
          this.dismissLoading();
          console.log('err : consumers', err);
        },
        () => {}
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
