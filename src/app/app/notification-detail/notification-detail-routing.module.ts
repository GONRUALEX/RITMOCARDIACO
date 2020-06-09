import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationDetailPage } from './notification-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationDetailPageRoutingModule {}
