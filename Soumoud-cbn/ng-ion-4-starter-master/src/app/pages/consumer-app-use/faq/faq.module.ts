import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';
import { MaterialModule } from '../../../material.module';

import { FaqPage } from './faq.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FaqPageRoutingModule,
    MaterialModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
