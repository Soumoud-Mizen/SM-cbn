import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderAppUsePage } from './provider-app-use.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderAppUsePage
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderAppUsePageRoutingModule {}
