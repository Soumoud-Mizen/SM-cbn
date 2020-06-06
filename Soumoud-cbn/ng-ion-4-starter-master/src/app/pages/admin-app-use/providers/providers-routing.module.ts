import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvidersPage } from './providers.page';

const routes: Routes = [
  {
    path: '',
    component: ProvidersPage
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
export class ProvidersPageRoutingModule {}
