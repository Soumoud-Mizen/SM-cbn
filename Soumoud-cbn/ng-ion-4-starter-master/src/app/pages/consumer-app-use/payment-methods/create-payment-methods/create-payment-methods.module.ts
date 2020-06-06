import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePaymentMethodsPageRoutingModule } from './create-payment-methods-routing.module';

import { CreatePaymentMethodsPage } from './create-payment-methods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePaymentMethodsPageRoutingModule
  ],
  declarations: [CreatePaymentMethodsPage]
})
export class CreatePaymentMethodsPageModule {}
