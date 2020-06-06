import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumersPage } from './consumers.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumersPage
  },
  {
    path: 'consumer',
    loadChildren: () => import('./consumer/consumer.module').then( m => m.ConsumerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumersPageRoutingModule {}
