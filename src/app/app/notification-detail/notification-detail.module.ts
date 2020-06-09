import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationDetailPageRoutingModule } from './notification-detail-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationDetailPage } from './notification-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationDetailPageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [NotificationDetailPage]
})
export class NotificationDetailPageModule {}
