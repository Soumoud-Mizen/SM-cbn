import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionsPageRoutingModule } from './promotions-routing.module';

import { PromotionsPage } from './promotions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionsPageRoutingModule
  ],
  declarations: [PromotionsPage]
})
export class PromotionsPageModule {}
