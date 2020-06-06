import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvidersConfirmPageRoutingModule } from './providers-confirm-routing.module';

import { ProvidersConfirmPage } from './providers-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvidersConfirmPageRoutingModule
  ],
  declarations: [ProvidersConfirmPage]
})
export class ProvidersConfirmPageModule {}
