import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqPage } from './faq.page';

const routes: Routes = [
  {
    path: '',
    component: FaqPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'show',
    loadChildren: () => import('./show/show.module').then( m => m.ShowPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqPageRoutingModule {}
