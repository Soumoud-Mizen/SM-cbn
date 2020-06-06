import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';

import { Service } from '../../services/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  submitted = false;
  authForm: FormGroup;
  returnUrl: string;
  loading = false;
  loadingComponent = null;
  URL_user = '/';
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public Service: Service,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    // this.router.navigate(['/']);
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      },
      {}
    );

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }
 
  onSubmit(value: any): void {
    this.submitted = true;

    // Stop if the form validation has failed
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    this.presentLoading();
    this.Service.login(this.frm.email.value, this.frm.password.value)
      .pipe(first())
      .subscribe(
        token => {
          this.Service.getUserProfile(token).subscribe(
            userProfile => {
              this.loading = false;
              this.dismissLoading();
              switch (userProfile.role) {
                case 'consumer':
                  this.URL_user = '/consumer-app-use';
                  break;
                case 'admin':
                  this.URL_user = '/admin-app-use/faq';
                  break;
                case 'provider':
                  this.URL_user = '/provider-app-use';
                  break;
                default:
                  break;
              }
              this.router.navigate([this.returnUrl || this.URL_user]);
            },
            err => {
              // console.log('err : userProfile', err);
              this.loading = false;
              this.dismissLoading();
              this.presentAlert(err.err.msg);
            }
          );
        },
        error => {
          this.loading = false;
          this.dismissLoading();
          // console.log('error', error);
          this.presentAlert(error.error.msg);
        }
      );
  }

  onReset() {
    this.submitted = false;
    this.authForm.reset();
  }
 
  openAlert() {
    this.presentAlert('Contacter Admin pour changer votre mot de passe');
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Message',
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

  get frm() {
    return this.authForm.controls;
  }
}
