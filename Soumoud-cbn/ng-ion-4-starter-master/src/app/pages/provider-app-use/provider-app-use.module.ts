import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderAppUsePageRoutingModule } from './provider-app-use-routing.module';

import { ProviderAppUsePage } from './provider-app-use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderAppUsePageRoutingModule
  ],
  declarations: [ProviderAppUsePage]
})
export class ProviderAppUsePageModule {}
