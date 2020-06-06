import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterConsumerPage } from './register-consumer.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterConsumerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterConsumerPageRoutingModule {}
