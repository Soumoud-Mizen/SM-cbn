import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainAppUsePageRoutingModule } from './main-app-use-routing.module';

import { MainAppUsePage } from './main-app-use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainAppUsePageRoutingModule
  ],
  declarations: [MainAppUsePage]
})
export class MainAppUsePageModule {}
