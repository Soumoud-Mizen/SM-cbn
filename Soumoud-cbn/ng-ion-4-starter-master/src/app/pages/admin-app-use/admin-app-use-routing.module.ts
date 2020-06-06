import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAppUsePage } from './admin-app-use.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAppUsePage
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'consumers',
    loadChildren: () => import('./consumers/consumers.module').then( m => m.ConsumersPageModule)
  },
  {
    path: 'providers',
    loadChildren: () => import('./providers/providers.module').then( m => m.ProvidersPageModule)
  },
  {
    path: 'providers-confirm',
    loadChildren: () => import('./providers-confirm/providers-confirm.module').then( m => m.ProvidersConfirmPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'edit-user',
    loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAppUsePageRoutingModule {}
