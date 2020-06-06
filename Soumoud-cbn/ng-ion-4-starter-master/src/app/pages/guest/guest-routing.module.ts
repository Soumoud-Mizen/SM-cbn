import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestPage } from './guest.page';

const routes: Routes = [
  {
    path: '',
    component: GuestPage
  },
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module').then( m => m.ProviderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestPageRoutingModule {}
