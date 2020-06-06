import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumerAppUsePageRoutingModule } from './consumer-app-use-routing.module';

import { ConsumerAppUsePage } from './consumer-app-use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumerAppUsePageRoutingModule
  ],
  declarations: [ConsumerAppUsePage]
})
export class ConsumerAppUsePageModule {}
