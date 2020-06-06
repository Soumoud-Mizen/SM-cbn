import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePaymentMethodsPage } from './create-payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePaymentMethodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePaymentMethodsPageRoutingModule {}
