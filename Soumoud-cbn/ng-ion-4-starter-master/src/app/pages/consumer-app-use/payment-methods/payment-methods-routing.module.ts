import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodsPage } from './payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage
  },
  {
    path: 'create-payment-methods',
    loadChildren: () => import('./create-payment-methods/create-payment-methods.module').then( m => m.CreatePaymentMethodsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsPageRoutingModule {}
