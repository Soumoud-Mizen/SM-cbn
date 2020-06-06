import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvidersConfirmPage } from './providers-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ProvidersConfirmPage
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
export class ProvidersConfirmPageRoutingModule {}
