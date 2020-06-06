import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatsPage } from './chats.page';

const routes: Routes = [
  {
    path: '',
    component: ChatsPage
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.module').then( m => m.RoomPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsPageRoutingModule {}
