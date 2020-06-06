import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumerPageRoutingModule } from './consumer-routing.module';

import { ConsumerPage } from './consumer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumerPageRoutingModule
  ],
  declarations: [ConsumerPage]
})
export class ConsumerPageModule {}
