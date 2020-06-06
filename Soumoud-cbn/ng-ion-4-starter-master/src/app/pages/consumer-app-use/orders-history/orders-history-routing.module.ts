import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersHistoryPage } from './orders-history.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersHistoryPage
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersHistoryPageRoutingModule {}
