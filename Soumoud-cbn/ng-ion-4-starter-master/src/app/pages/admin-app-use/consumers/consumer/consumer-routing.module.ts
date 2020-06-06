import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumerPage } from './consumer.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerPageRoutingModule {}
