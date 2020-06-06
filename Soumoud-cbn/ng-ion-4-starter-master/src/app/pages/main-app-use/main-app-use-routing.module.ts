import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainAppUsePage } from './main-app-use.page';

const routes: Routes = [
  {
    path: '',
    component: MainAppUsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainAppUsePageRoutingModule {}
