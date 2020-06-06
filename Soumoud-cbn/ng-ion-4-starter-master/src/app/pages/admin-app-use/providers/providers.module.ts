import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvidersPageRoutingModule } from './providers-routing.module';

import { ProvidersPage } from './providers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvidersPageRoutingModule
  ],
  declarations: [ProvidersPage]
})
export class ProvidersPageModule {}
