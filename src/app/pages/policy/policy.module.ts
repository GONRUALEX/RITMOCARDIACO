import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { PolicyPageRoutingModule } from './policy-routing.module';

import { PolicyPage } from './policy.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolicyPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [PolicyPage]
})
export class PolicyPageModule {}
