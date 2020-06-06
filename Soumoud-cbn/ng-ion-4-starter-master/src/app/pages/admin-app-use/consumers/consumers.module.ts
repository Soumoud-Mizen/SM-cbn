import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumersPageRoutingModule } from './consumers-routing.module';

import { ConsumersPage } from './consumers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumersPageRoutingModule
  ],
  declarations: [ConsumersPage]
})
export class ConsumersPageModule {}
