import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAppUsePageRoutingModule } from './admin-app-use-routing.module';

import { AdminAppUsePage } from './admin-app-use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAppUsePageRoutingModule
  ],
  declarations: [AdminAppUsePage]
})
export class AdminAppUsePageModule {}
