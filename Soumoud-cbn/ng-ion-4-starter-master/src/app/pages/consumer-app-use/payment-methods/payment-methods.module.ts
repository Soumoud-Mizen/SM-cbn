import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodsPageRoutingModule } from './payment-methods-routing.module';

import { PaymentMethodsPage } from './payment-methods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodsPageRoutingModule
  ],
  declarations: [PaymentMethodsPage]
})
export class PaymentMethodsPageModule {}
